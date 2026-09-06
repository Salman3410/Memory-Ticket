import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth";

import {
  getNetworkInfo,
  addNetworkListener,
} from "../services/networkService";

import {
  getCurrentLocation,
} from "../services/locationService";

import {
  getMemories as getMemoriesApi,
  createMemory as createMemoryApi,
  updateMemory as updateMemoryApi,
  deleteMemory as deleteMemoryApi,
  deleteAllMemories as deleteAllMemoriesApi,
  toggleFavorite as toggleFavoriteApi,
} from "../api/memoryApi";

import {
  generateClientMemoryId,
  persistMemoryImages,
  getPendingMemories,
  addPendingMemory,
  removePendingMemory,
  getOfflineMemories,
  upsertLocalMemory,
  clearLocalMemories,
} from "../services/offlineMemoryService";

export const MemoryContext =
  createContext(null);

export function MemoryProvider({
  children,
}) {
  const {
    token,
    loading: authLoading,
  } = useAuth();

  const [memories, setMemories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [syncing, setSyncing] =
    useState(false);

  const syncLock =
    useRef(false);

  // --------------------------------------------------
  // NORMALIZE BACKEND MEMORY
  // --------------------------------------------------

  const normalizeMemory = useCallback(
    (memory) => {
      if (!memory) {
        return null;
      }

      const images = Array.isArray(
        memory.images,
      )
        ? memory.images
        : [];

      return {
        ...memory,

        // MongoDB ID -> frontend ID
        id:
          memory._id ||
          memory.id ||
          memory.clientMemoryId,

        images,

        image:
          images[0] || null,

        favorite:
          memory.isFavorite === true,

        locationData:
          memory.locationData ||
          null,

        environment: {
          network:
            memory.network ||
            null,
        },

        imagePublicIds:
          Array.isArray(
            memory.imagePublicIds,
          )
            ? memory.imagePublicIds
            : [],

        syncStatus:
          memory.syncStatus ||
          "synced",
      };
    },
    [],
  );

  // --------------------------------------------------
  // LOAD LOCAL/OFFLINE MEMORIES
  // --------------------------------------------------

  const loadOfflineMemories =
    useCallback(async () => {
      if (!token) {
        return;
      }

      try {
        const offlineMemories =
          await getOfflineMemories();

        const normalized =
          offlineMemories
            .map((memory) => {
              const result =
                normalizeMemory(
                  memory,
                );

              if (
                result &&
                memory.localImages?.length &&
                !memory.images?.length
              ) {
                result.images =
                  memory.localImages;

                result.image =
                  memory.localImages[0] ||
                  null;
              }

              return result;
            })
            .filter(Boolean);

        if (normalized.length) {
          setMemories(
            (current) => {
              const merged = [
                ...normalized,
                ...current,
              ];

              const unique = [];
              const seen = new Set();

              for (const memory of merged) {
                const key =
                  memory.clientMemoryId ||
                  memory.id;

                if (
                  !key ||
                  seen.has(key)
                ) {
                  continue;
                }

                seen.add(key);
                unique.push(memory);
              }

              return unique;
            },
          );
        }
      } catch (error) {
        console.error(
          "Load offline memories error:",
          error,
        );
      }
    }, [
      token,
      normalizeMemory,
    ]);

  // --------------------------------------------------
  // LOAD SERVER MEMORIES
  // --------------------------------------------------

  const loadMemories =
    useCallback(async () => {
      if (!token) {
        setMemories([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const network =
          await getNetworkInfo();

        if (
          network.isConnected === false ||
          network.isInternetReachable ===
            false
        ) {
          await loadOfflineMemories();
          return;
        }

        const result =
          await getMemoriesApi(token);

        if (!result.success) {
          console.error(
            "Load memories failed:",
            result.message,
          );

          await loadOfflineMemories();
          return;
        }

        const backendMemories =
          Array.isArray(
            result.data?.memories,
          )
            ? result.data.memories
            : [];

        const normalized =
          backendMemories
            .map(normalizeMemory)
            .filter(Boolean);

        // Keep pending memories that have
        // not reached the backend yet.
        const pending =
          await getPendingMemories();

        const normalizedPending =
          pending
            .map((memory) => {
              const result =
                normalizeMemory(
                  memory,
                );

              if (
                result &&
                memory.localImages?.length
              ) {
                result.images =
                  memory.localImages;

                result.image =
                  memory.localImages[0] ||
                  null;
              }

              return result;
            })
            .filter(Boolean);

        setMemories([
          ...normalizedPending,
          ...normalized,
        ]);
      } catch (error) {
        console.error(
          "Load memories error:",
          error,
        );

        await loadOfflineMemories();
      } finally {
        setLoading(false);
      }
    }, [
      token,
      normalizeMemory,
      loadOfflineMemories,
    ]);

  // --------------------------------------------------
  // SYNC ONE MEMORY
  // --------------------------------------------------

  const syncMemory = useCallback(
    async (pendingMemory) => {
      if (!token || !pendingMemory) {
        return false;
      }

      try {
        const result =
          await createMemoryApi(
            token,
            pendingMemory,
          );

        if (!result.success) {
          console.error(
            "Memory sync failed:",
            result.message,
          );

          return false;
        }

        const savedMemory =
          normalizeMemory(
            result.data?.memory,
          );

        if (!savedMemory) {
          return false;
        }

        // Remove from pending queue.
        await removePendingMemory(
          pendingMemory.clientMemoryId,
        );

        // Update local cache.
        await upsertLocalMemory({
          ...savedMemory,

          clientMemoryId:
            pendingMemory.clientMemoryId,

          localImages:
            pendingMemory.localImages ||
            [],
          
          syncStatus: "synced",
        });

        // Update UI.
        setMemories(
          (currentMemories) =>
            currentMemories.map(
              (memory) => {
                const sameClientId =
                  memory.clientMemoryId ===
                  pendingMemory.clientMemoryId;

                return sameClientId
                  ? {
                      ...savedMemory,
                      clientMemoryId:
                        pendingMemory.clientMemoryId,
                      localImages:
                        pendingMemory.localImages ||
                        [],
                      syncStatus:
                        "synced",
                    }
                  : memory;
              },
            ),
        );

        return savedMemory;
      } catch (error) {
        console.error(
          "Sync memory error:",
          error,
        );

        return false;
      }
    },
    [
      token,
      normalizeMemory,
    ],
  );

  // --------------------------------------------------
  // SYNC ALL PENDING MEMORIES
  // --------------------------------------------------

  const syncPendingMemories =
    useCallback(async () => {
      if (!token || syncLock.current) {
        return;
      }

      try {
        const network =
          await getNetworkInfo();

        if (
          network.isConnected === false ||
          network.isInternetReachable ===
            false
        ) {
          return;
        }

        const pending =
          await getPendingMemories();

        if (!pending.length) {
          return;
        }

        syncLock.current = true;
        setSyncing(true);

        for (
          const pendingMemory of pending
        ) {
          const success =
            await syncMemory(
              pendingMemory,
            );

          if (!success) {
            // Stop for now.
            // We'll retry on the next
            // network event.
            break;
          }
        }
      } catch (error) {
        console.error(
          "Sync pending memories error:",
          error,
        );
      } finally {
        syncLock.current = false;
        setSyncing(false);
      }
    }, [
      token,
      syncMemory,
    ]);

  // --------------------------------------------------
  // LOAD WHEN AUTH IS READY
  // --------------------------------------------------

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadMemories();
  }, [
    authLoading,
    token,
    loadMemories,
  ]);

  // --------------------------------------------------
  // NETWORK LISTENER
  // --------------------------------------------------

  useEffect(() => {
    if (authLoading || !token) {
      return undefined;
    }

    const subscription =
      addNetworkListener(
        ({
          isConnected,
          isInternetReachable,
        }) => {
          const online =
            isConnected !== false &&
            isInternetReachable !==
              false;

          if (online) {
            syncPendingMemories();
          }
        },
      );

    // Also attempt once immediately.
    syncPendingMemories();

    return () => {
      subscription?.remove?.();
    };
  }, [
    authLoading,
    token,
    syncPendingMemories,
  ]);

  // --------------------------------------------------
  // CREATE MEMORY
  // --------------------------------------------------

  const addMemory = async (
    memory,
  ) => {
    if (!token) {
      throw new Error(
        "You must be logged in to create a memory.",
      );
    }

    try {
      // --------------------------------------------------
      // CLIENT MEMORY ID
      // --------------------------------------------------

      const clientMemoryId =
        memory?.clientMemoryId ||
        generateClientMemoryId();

      // --------------------------------------------------
      // GET NETWORK INFORMATION
      // --------------------------------------------------

      let network = null;

      try {
        network =
          await getNetworkInfo();

        console.log(
          "Network info captured for memory:",
          network,
        );
      } catch (networkError) {
        console.error(
          "Failed to get network info:",
          networkError,
        );
      }

      // --------------------------------------------------
      // GET LOCATION INFORMATION
      // --------------------------------------------------

      let locationData =
        memory?.locationData ||
        null;

      try {
        if (!locationData) {
          locationData =
            await getCurrentLocation();

          console.log(
            "Location info captured for memory:",
            locationData,
          );
        } else {
          console.log(
            "Using existing location data:",
            locationData,
          );
        }
      } catch (locationError) {
        console.error(
          "Failed to get location info:",
          locationError,
        );
      }

      // --------------------------------------------------
      // HUMAN-READABLE LOCATION
      // --------------------------------------------------

      const finalLocation =
        typeof memory?.location ===
          "string" &&
        memory.location.trim()
          ? memory.location.trim()
          : locationData
              ?.readableLocation ||
            "";

      // --------------------------------------------------
      // PERSIST IMAGES LOCALLY FIRST
      // --------------------------------------------------

      const {
        localImages,
      } =
        await persistMemoryImages({
          ...memory,
          clientMemoryId,
        });

      // --------------------------------------------------
      // MERGE ALL DATA
      // --------------------------------------------------

      const memoryWithMetadata = {
        ...memory,

        clientMemoryId,

        location:
          finalLocation,

        locationData,

        network:
          memory?.network ||
          memory?.environment?.network ||
          network,

        images:
          localImages,

        localImages,

        syncStatus: "pending",
      };

      // --------------------------------------------------
      // SHOW MEMORY IMMEDIATELY
      // --------------------------------------------------

      const localMemory =
        normalizeMemory(
          memoryWithMetadata,
        );

      if (localMemory) {
        localMemory.clientMemoryId =
          clientMemoryId;

        localMemory.images =
          localImages;

        localMemory.image =
          localImages[0] ||
          null;

        localMemory.localImages =
          localImages;

        localMemory.syncStatus =
          "pending";

        setMemories(
          (current) => [
            localMemory,
            ...current,
          ],
        );
      }

      // --------------------------------------------------
      // SAVE LOCALLY BEFORE NETWORK REQUEST
      // --------------------------------------------------

      await upsertLocalMemory({
        ...memoryWithMetadata,

        clientMemoryId,

        images: localImages,

        localImages,

        syncStatus: "pending",
      });

      await addPendingMemory({
        ...memoryWithMetadata,

        clientMemoryId,

        images: localImages,

        localImages,

        syncStatus: "pending",
      });

      // --------------------------------------------------
      // TRY IMMEDIATE SYNC
      // --------------------------------------------------

      const networkState =
        await getNetworkInfo();

      const online =
        networkState.isConnected !==
          false &&
        networkState.isInternetReachable !==
          false;

      if (!online) {
        console.log(
          "No internet. Memory saved locally and marked pending.",
        );

        return localMemory;
      }

      const syncedMemory =
        await syncMemory({
          ...memoryWithMetadata,

          clientMemoryId,

          images: localImages,

          localImages,
        });

      if (!syncedMemory) {
        console.log(
          "Memory could not be synced. It remains pending.",
        );

        return localMemory;
      }

      // Get the latest version from state
      const savedMemory =
        getMemoryById(
          clientMemoryId,
        );

      return savedMemory ||
        localMemory;
    } catch (error) {
      console.error(
        "Add memory error:",
        error,
      );

      throw error;
    }
  };

  // --------------------------------------------------
  // UPDATE MEMORY
  // --------------------------------------------------

  const updateMemory = async (
    memoryId,
    updatedData,
  ) => {
    if (!token) {
      throw new Error(
        "You must be logged in.",
      );
    }

    if (!memoryId) {
      throw new Error(
        "Memory ID is required.",
      );
    }

    const existingMemory =
      memories.find(
        (memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId ===
            memoryId,
      );

    if (!existingMemory) {
      throw new Error(
        "Memory not found.",
      );
    }

    const result =
      await updateMemoryApi(
        token,
        memoryId,
        updatedData,
      );

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to update memory.",
      );
    }

    const updatedMemory =
      normalizeMemory(
        result.data?.memory,
      );

    if (!updatedMemory) {
      throw new Error(
        "Server returned invalid memory data.",
      );
    }

    setMemories(
      (currentMemories) =>
        currentMemories.map(
          (memory) =>
            memory.id === memoryId
              ? updatedMemory
              : memory,
        ),
    );

    await upsertLocalMemory(
      updatedMemory,
    );

    return updatedMemory;
  };

  // --------------------------------------------------
  // DELETE MEMORY
  // --------------------------------------------------

  const deleteMemory = async (
    memoryId,
  ) => {
    if (!token) {
      throw new Error(
        "You must be logged in.",
      );
    }

    if (!memoryId) {
      throw new Error(
        "Memory ID is required.",
      );
    }

    const existingMemory =
      memories.find(
        (memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId ===
            memoryId,
      );

    // --------------------------------------------------
    // PENDING OFFLINE MEMORY
    // --------------------------------------------------

    if (
      existingMemory?.syncStatus ===
        "pending" &&
      existingMemory.clientMemoryId
    ) {
      await removePendingMemory(
        existingMemory.clientMemoryId,
      );

      await removeLocalMemory(
        null,
        existingMemory.clientMemoryId,
      );

      setMemories(
        (currentMemories) =>
          currentMemories.filter(
            (memory) =>
              memory.clientMemoryId !==
              existingMemory.clientMemoryId,
          ),
      );

      return true;
    }

    // --------------------------------------------------
    // SYNCED MEMORY
    // --------------------------------------------------

    const result =
      await deleteMemoryApi(
        token,
        memoryId,
      );

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to delete memory.",
      );
    }

    setMemories(
      (currentMemories) =>
        currentMemories.filter(
          (memory) =>
            memory.id !==
            memoryId,
        ),
    );

    await removeLocalMemory(
      memoryId,
    );

    return true;
  };

  // --------------------------------------------------
  // TOGGLE FAVORITE
  // --------------------------------------------------

  const toggleFavorite = async (
    memoryId,
  ) => {
    if (!token) {
      throw new Error(
        "You must be logged in.",
      );
    }

    const existingMemory =
      memories.find(
        (memory) =>
          memory.id === memoryId ||
          memory.clientMemoryId ===
            memoryId,
      );

    // Pending memories cannot be updated
    // on the backend yet.
    if (
      existingMemory?.syncStatus ===
      "pending"
    ) {
      const nextFavorite =
        !existingMemory.favorite;

      const updated = {
        ...existingMemory,

        favorite:
          nextFavorite,

        isFavorite:
          nextFavorite,

        syncStatus:
          "pending",
      };

      setMemories(
        (currentMemories) =>
          currentMemories.map(
            (memory) =>
              memory.id === memoryId ||
              memory.clientMemoryId ===
                memoryId
                ? updated
                : memory,
          ),
      );

      return updated;
    }

    const result =
      await toggleFavoriteApi(
        token,
        memoryId,
      );

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to update favorite.",
      );
    }

    const updatedMemory =
      normalizeMemory(
        result.data?.memory,
      );

    if (!updatedMemory) {
      throw new Error(
        "Server returned invalid memory data.",
      );
    }

    setMemories(
      (currentMemories) =>
        currentMemories.map(
          (memory) =>
            memory.id === memoryId
              ? updatedMemory
              : memory,
        ),
    );

    await upsertLocalMemory(
      updatedMemory,
    );

    return updatedMemory;
  };

  // --------------------------------------------------
  // FIND MEMORY
  // --------------------------------------------------

  const getMemoryById = (
    memoryId,
  ) => {
    return memories.find(
      (memory) =>
        memory.id === memoryId ||
        memory.clientMemoryId ===
          memoryId,
    );
  };

  // --------------------------------------------------
  // MANUAL SYNC
  // --------------------------------------------------

  const syncNow = async () => {
    await syncPendingMemories();
  };

  // --------------------------------------------------
  // CLEAR LOCAL CONTEXT
  // --------------------------------------------------

const clearMemories = async () => {
  if (!token) {
    throw new Error(
      "You must be logged in.",
    );
  }

  try {
    const result =
      await deleteAllMemoriesApi(token);

    if (!result.success) {
      throw new Error(
        result.message ||
          "Unable to clear memory storage.",
      );
    }

    // Clear UI state
    setMemories([]);

    // Clear locally cached/pending memories
    const pending =
      await getPendingMemories();

    for (const memory of pending) {
      if (memory.clientMemoryId) {
        await removePendingMemory(
          memory.clientMemoryId,
        );
      }
    }

    // Clear local memory cache
    // by rebuilding it as empty.
    await clearLocalMemories([]);

    return {
      success: true,
      deletedCount:
        result.data?.deletedCount || 0,
    };
  } catch (error) {
    console.error(
      "Clear memories error:",
      error,
    );

    throw error;
  }
};

  // --------------------------------------------------
  // PROVIDER
  // --------------------------------------------------

  return (
    <MemoryContext.Provider
      value={{
        memories,

        loading,

        syncing,

        addMemory,

        updateMemory,

        deleteMemory,

        toggleFavorite,

        getMemoryById,

        loadMemories,

        refreshMemories:
          loadMemories,

        syncNow,

        clearMemories,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}

