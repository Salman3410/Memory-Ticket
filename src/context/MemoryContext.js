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
  removeLocalMemory,
  clearLocalMemories,
} from "../services/offlineMemoryService";

export const MemoryContext =
  createContext(null);

export function MemoryProvider({ children }) {
  const { token, loading: authLoading } = useAuth();

  const [memories, setMemories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [syncing, setSyncing] = useState(false);

  const syncLock = useRef(false);

  // --------------------------------------------------
  // NORMALIZE MEMORY
  // --------------------------------------------------

  const normalizeMemory = useCallback((memory) => {
    if (!memory) {
      return null;
    }

    const images = Array.isArray(memory.images) ? memory.images : [];

    return {
      ...memory,

      id: memory._id || memory.id || memory.clientMemoryId,

      images,

      image: images[0] || null,

      favorite: memory.isFavorite === true,

      locationData: memory.locationData || null,

      environment: {
        network: memory.network || null,
      },

      imagePublicIds: Array.isArray(memory.imagePublicIds)
        ? memory.imagePublicIds
        : [],

      syncStatus: memory.syncStatus || "synced",
    };
  }, []);

  // --------------------------------------------------
  // MERGE SERVER + LOCAL DATA
  // --------------------------------------------------

  const mergeMemories = useCallback(
    (serverMemories, localMemories, pendingMemories) => {
      const localMap = new Map();

      for (const memory of localMemories) {
        const key = memory.clientMemoryId || memory.id;

        if (key) {
          localMap.set(key, memory);
        }
      }

      const pendingMap = new Map();

      for (const memory of pendingMemories) {
        const key = memory.clientMemoryId || memory.id;

        if (key) {
          pendingMap.set(key, memory);
        }
      }

      const mergedServer = serverMemories.map((memory) => {
        const key = memory.clientMemoryId || memory.id;

        const local = localMap.get(key);

        const normalized = normalizeMemory(memory);

        if (local?.localImages?.length) {
          normalized.localImages = local.localImages;
        }

        return normalized;
      });

      const serverKeys = new Set(
        mergedServer.map((memory) => memory.clientMemoryId || memory.id),
      );

      const remainingPending = pendingMemories
        .filter((memory) => {
          const key = memory.clientMemoryId || memory.id;

          return !serverKeys.has(key);
        })
        .map((memory) => {
          const normalized = normalizeMemory(memory);

          if (memory.localImages?.length) {
            normalized.images = memory.localImages;

            normalized.image = memory.localImages[0] || null;

            normalized.localImages = memory.localImages;
          }

          return normalized;
        });

      return [...remainingPending, ...mergedServer].filter(Boolean);
    },
    [normalizeMemory],
  );

  // --------------------------------------------------
  // LOAD LOCAL DATA
  // --------------------------------------------------

  const loadLocalMemories = useCallback(async () => {
    if (!token) {
      return [];
    }

    try {
      const offlineMemories = await getOfflineMemories();

      const normalized = offlineMemories
        .map((memory) => {
          const result = normalizeMemory(memory);

          if (result && memory.localImages?.length) {
            result.images = memory.localImages;

            result.image = memory.localImages[0] || null;

            result.localImages = memory.localImages;
          }

          return result;
        })
        .filter(Boolean);

      if (normalized.length) {
        setMemories(normalized);
      }

      return normalized;
    } catch (error) {
      console.error("Load local memories error:", error);

      return [];
    }
  }, [token, normalizeMemory]);

  // --------------------------------------------------
  // LOAD SERVER DATA
  // --------------------------------------------------

  const refreshServerMemories = useCallback(async () => {
    if (!token) {
      return false;
    }

    try {
      const result = await getMemoriesApi(token);

      if (!result.success) {
        return false;
      }

      const backendMemories = Array.isArray(result.data?.memories)
        ? result.data.memories
        : [];

      const [localMemories, pendingMemories] = await Promise.all([
        import("../services/offlineMemoryService").then(
          ({ getLocalMemories }) => getLocalMemories(),
        ),

        getPendingMemories(),
      ]);

      const normalizedServer = backendMemories
        .map(normalizeMemory)
        .filter(Boolean);

      // Preserve persistent local image
      // copies while updating server data.
      const serverWithLocalImages = normalizedServer.map((memory) => {
        const key = memory.clientMemoryId || memory.id;

        const local = localMemories.find(
          (item) => (item.clientMemoryId || item.id) === key,
        );

        if (local?.localImages?.length) {
          return {
            ...memory,
            localImages: local.localImages,
          };
        }

        return memory;
      });

      const merged = mergeMemories(
        serverWithLocalImages,
        localMemories,
        pendingMemories,
      );

      setMemories(merged);

      // Cache the latest merged data locally.
      for (const memory of serverWithLocalImages) {
        await upsertLocalMemory({
          ...memory,
          syncStatus: "synced",
        });
      }

      return true;
    } catch (error) {
      console.error("Refresh server memories error:", error);

      return false;
    }
  }, [
    token,
    normalizeMemory,
    mergeMemories,
    getPendingMemories,
    upsertLocalMemory,
  ]);

  // --------------------------------------------------
  // LOAD MEMORIES
  // --------------------------------------------------

  const loadMemories = useCallback(async () => {
    if (!token) {
      setMemories([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Load local data first.
      const localMemories = await loadLocalMemories();

      // Immediately release loading state
      // after local data is available.
      setLoading(false);

      // Refresh backend in background.
      const network = await getNetworkInfo();

      const online =
        network.isConnected !== false && network.isInternetReachable !== false;

      if (online) {
        await refreshServerMemories();
      }
    } catch (error) {
      console.error("Load memories error:", error);

      setLoading(false);
    }
  }, [token, loadLocalMemories, refreshServerMemories]);

  // --------------------------------------------------
  // SYNC ONE MEMORY
  // --------------------------------------------------

  const syncMemory = useCallback(
    async (pendingMemory) => {
      if (!token || !pendingMemory) {
        return null;
      }

      try {
        const result = await createMemoryApi(token, pendingMemory);

        if (!result.success) {
          console.error("Memory sync failed:", result.message);

          return null;
        }

        const savedMemory = normalizeMemory(result.data?.memory);

        if (!savedMemory) {
          return null;
        }

        const syncedMemory = {
          ...savedMemory,

          clientMemoryId: pendingMemory.clientMemoryId,

          localImages: pendingMemory.localImages || [],

          syncStatus: "synced",
        };

        // These two storage operations are
        // independent, so execute them together.
        await Promise.all([
          removePendingMemory(pendingMemory.clientMemoryId),

          upsertLocalMemory(syncedMemory),
        ]);

        setMemories((currentMemories) =>
          currentMemories.map((memory) =>
            memory.clientMemoryId === pendingMemory.clientMemoryId
              ? syncedMemory
              : memory,
          ),
        );

        return syncedMemory;
      } catch (error) {
        console.error("Sync memory error:", error);

        return null;
      }
    },
    [token, normalizeMemory],
  );

  // --------------------------------------------------
  // SYNC ALL PENDING
  // --------------------------------------------------

  const syncPendingMemories = useCallback(async () => {
    if (!token || syncLock.current) {
      return;
    }

    try {
      const network = await getNetworkInfo();

      const online =
        network.isConnected !== false && network.isInternetReachable !== false;

      if (!online) {
        return;
      }

      const pending = await getPendingMemories();

      if (!pending.length) {
        return;
      }

      syncLock.current = true;
      setSyncing(true);

      for (const pendingMemory of pending) {
        const synced = await syncMemory(pendingMemory);

        if (!synced) {
          // Leave this memory in the queue.
          // Retry later.
          break;
        }
      }
    } catch (error) {
      console.error("Sync pending memories error:", error);
    } finally {
      syncLock.current = false;
      setSyncing(false);
    }
  }, [token, syncMemory]);

  // --------------------------------------------------
  // AUTH READY
  // --------------------------------------------------

  useEffect(() => {
    if (authLoading) {
      return;
    }

    loadMemories();
  }, [authLoading, token, loadMemories]);

  // --------------------------------------------------
  // NETWORK LISTENER
  // --------------------------------------------------

  useEffect(() => {
    if (authLoading || !token) {
      return undefined;
    }

    const subscription = addNetworkListener(
      ({ isConnected, isInternetReachable }) => {
        const online = isConnected !== false && isInternetReachable !== false;

        if (online) {
          syncPendingMemories();

          // Refresh server data after
          // connectivity is restored.
          refreshServerMemories();
        }
      },
    );

    syncPendingMemories();

    return () => {
      subscription?.remove?.();
    };
  }, [authLoading, token, syncPendingMemories, refreshServerMemories]);

  const addMemory = async (memory) => {
    if (!token) {
      throw new Error("You must be logged in to create a memory.");
    }

    try {
      const clientMemoryId = memory?.clientMemoryId || generateClientMemoryId();

      // Network and location are independent.
      const [networkResult, locationResult] = await Promise.all([
        getNetworkInfo().catch((error) => {
          console.error("Network info error:", error);
          return null;
        }),

        memory?.locationData
          ? Promise.resolve(memory.locationData)
          : getCurrentLocation().catch((error) => {
              console.error("Location error:", error);
              return null;
            }),
      ]);

      const locationData = locationResult || null;

      // Keep the user's manual location.
      const finalLocation =
        typeof memory?.location === "string" ? memory.location.trim() : "";

      // Copy all images in parallel.
      const { localImages } = await persistMemoryImages({
        ...memory,
        clientMemoryId,
      });

      const finalNetwork =
        memory?.network || memory?.environment?.network || networkResult;

      const localMemoryData = {
        ...memory,
        clientMemoryId,
        location: finalLocation,
        locationData,
        network: finalNetwork,
        images: localImages,
        localImages,
        syncStatus: "pending",
      };

      const localMemory = normalizeMemory(localMemoryData);

      if (!localMemory) {
        throw new Error("Unable to prepare local memory.");
      }

      // Show immediately in the app.
      setMemories((current) => [localMemory, ...current]);

      // Persist locally before returning.
      await Promise.all([
        upsertLocalMemory(localMemoryData),
        addPendingMemory(localMemoryData),
      ]);

      // Use the network state we already obtained.
      const online =
        networkResult?.isConnected !== false &&
        networkResult?.isInternetReachable !== false;

      if (online) {
        // IMPORTANT:
        // Do not wait for Cloudinary/MongoDB.
        // Sync in the background.
        syncMemory(localMemoryData).catch((error) => {
          console.error("Background memory sync failed:", error);
        });
      }

      // Return immediately after local save.
      return localMemory;
    } catch (error) {
      console.error("Add memory error:", error);
      throw error;
    }
  };

  // --------------------------------------------------
  // UPDATE MEMORY
  // --------------------------------------------------

  const updateMemory = async (memoryId, updatedData) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    if (!memoryId) {
      throw new Error("Memory ID is required.");
    }

    const existingMemory = memories.find(
      (memory) => memory.id === memoryId || memory.clientMemoryId === memoryId,
    );

    if (!existingMemory) {
      throw new Error("Memory not found.");
    }

    const result = await updateMemoryApi(token, memoryId, updatedData);

    if (!result.success) {
      throw new Error(result.message || "Unable to update memory.");
    }

    const updatedMemory = normalizeMemory(result.data?.memory);

    if (!updatedMemory) {
      throw new Error("Server returned invalid memory data.");
    }

    setMemories((currentMemories) =>
      currentMemories.map((memory) =>
        memory.id === memoryId
          ? {
              ...updatedMemory,
              localImages: memory.localImages || [],
            }
          : memory,
      ),
    );

    await upsertLocalMemory({
      ...updatedMemory,
      localImages: existingMemory.localImages || [],
    });

    return updatedMemory;
  };

  // --------------------------------------------------
  // DELETE MEMORY
  // --------------------------------------------------

  const deleteMemory = async (memoryId) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    if (!memoryId) {
      throw new Error("Memory ID is required.");
    }

    const existingMemory = memories.find(
      (memory) => memory.id === memoryId || memory.clientMemoryId === memoryId,
    );

    // Delete pending offline memory
    // without contacting backend.
    if (
      existingMemory?.syncStatus === "pending" &&
      existingMemory.clientMemoryId
    ) {
      await Promise.all([
        removePendingMemory(existingMemory.clientMemoryId),

        removeLocalMemory(null, existingMemory.clientMemoryId),
      ]);

      setMemories((currentMemories) =>
        currentMemories.filter(
          (memory) => memory.clientMemoryId !== existingMemory.clientMemoryId,
        ),
      );

      return true;
    }

    const result = await deleteMemoryApi(token, memoryId);

    if (!result.success) {
      throw new Error(result.message || "Unable to delete memory.");
    }

    setMemories((currentMemories) =>
      currentMemories.filter((memory) => memory.id !== memoryId),
    );

    await removeLocalMemory(memoryId);

    return true;
  };

  // --------------------------------------------------
  // TOGGLE FAVORITE
  // --------------------------------------------------

  const toggleFavorite = async (memoryId) => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const existingMemory = memories.find(
      (memory) => memory.id === memoryId || memory.clientMemoryId === memoryId,
    );

    if (existingMemory?.syncStatus === "pending") {
      const nextFavorite = !existingMemory.favorite;

      const updated = {
        ...existingMemory,

        favorite: nextFavorite,

        isFavorite: nextFavorite,

        syncStatus: "pending",
      };

      setMemories((currentMemories) =>
        currentMemories.map((memory) =>
          memory.id === memoryId || memory.clientMemoryId === memoryId
            ? updated
            : memory,
        ),
      );

      await Promise.all([
        upsertLocalMemory(updated),

        addPendingMemory(updated),
      ]);

      return updated;
    }

    const result = await toggleFavoriteApi(token, memoryId);

    if (!result.success) {
      throw new Error(result.message || "Unable to update favorite.");
    }

    const updatedMemory = normalizeMemory(result.data?.memory);

    if (!updatedMemory) {
      throw new Error("Server returned invalid memory data.");
    }

    setMemories((currentMemories) =>
      currentMemories.map((memory) =>
        memory.id === memoryId
          ? {
              ...updatedMemory,
              localImages: memory.localImages || [],
            }
          : memory,
      ),
    );

    await upsertLocalMemory(updatedMemory);

    return updatedMemory;
  };

  // --------------------------------------------------
  // FIND MEMORY
  // --------------------------------------------------

  const getMemoryById = (memoryId) => {
    return memories.find(
      (memory) => memory.id === memoryId || memory.clientMemoryId === memoryId,
    );
  };

  // --------------------------------------------------
  // MANUAL SYNC
  // --------------------------------------------------

  const syncNow = async () => {
    await syncPendingMemories();
  };

  // --------------------------------------------------
  // CLEAR MEMORY STORAGE
  // --------------------------------------------------

  const clearMemories = async () => {
    if (!token) {
      throw new Error("You must be logged in.");
    }

    const result = await deleteAllMemoriesApi(token);

    if (!result.success) {
      throw new Error(result.message || "Unable to clear memory storage.");
    }

    await Promise.all([
      clearLocalMemories(),
      (async () => {
        const pending = await getPendingMemories();

        if (!pending.length) {
          return;
        }

        await Promise.all(
          pending
            .filter((memory) => memory.clientMemoryId)
            .map((memory) => removePendingMemory(memory.clientMemoryId)),
        );
      })(),
    ]);

    setMemories([]);

    return {
      success: true,
      deletedCount: result.data?.deletedCount || 0,
    };
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
        refreshMemories: loadMemories,

        syncNow,
        clearMemories,
      }}
    >
      {children}
    </MemoryContext.Provider>
  );
}
