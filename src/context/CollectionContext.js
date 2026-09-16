import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../hooks/useAuth";

import {
  createCollection as createCollectionApi,
  getCollections,
  getCollectionById as getCollectionByIdApi,
  updateCollection as updateCollectionApi,
  deleteCollection as deleteCollectionApi,
  addMemoryToCollection as addMemoryToCollectionApi,
  removeMemoryFromCollection as removeMemoryFromCollectionApi,
} from "../api/collectionApi";

export const CollectionContext = createContext(null);

const extractCollections = (result) => {
  if (!result?.success) {
    return [];
  }

  if (Array.isArray(result.data?.collections)) {
    return result.data.collections;
  }

  return [];
};

const extractCollection = (result) => {
  if (!result?.success) {
    return null;
  }

  return result.data?.collection || null;
};

export function CollectionProvider({ children }) {
  const {
    user,
    token,
    loading: authLoading,
  } = useAuth();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------------
  // LOAD ALL COLLECTIONS
  // --------------------------------------------------

  const refreshCollections = useCallback(
    async () => {
      if (!user || !token) {
        setCollections([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const result = await getCollections(token);

        if (!result?.success) {
          console.error(
            "Get collections failed:",
            result?.message
          );

          return;
        }

        const nextCollections =
          extractCollections(result);

        setCollections(nextCollections);
      } catch (error) {
        console.error(
          "Failed to load collections:",
          error
        );
      } finally {
        setLoading(false);
      }
    },
    [user, token]
  );

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    if (authLoading) {
      return;
    }

    refreshCollections();
  }, [authLoading, refreshCollections]);

  // --------------------------------------------------
  // CREATE COLLECTION
  // --------------------------------------------------

  const createCollection = useCallback(
    async (collectionData) => {
      if (!token) {
        throw new Error(
          "Authentication token is missing."
        );
      }

      try {
        const result =
          await createCollectionApi(
            token,
            collectionData
          );

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to create collection."
          );
        }

        const newCollection =
          extractCollection(result);

        if (!newCollection) {
          throw new Error(
            "Server returned invalid collection data."
          );
        }

        setCollections((prev) => [
          newCollection,
          ...prev,
        ]);

        return newCollection;
      } catch (error) {
        console.error(
          "Failed to create collection:",
          error
        );

        throw error;
      }
    },
    [token]
  );

  // --------------------------------------------------
  // GET SINGLE COLLECTION
  // --------------------------------------------------

  const getCollectionById = useCallback(
    async (collectionId) => {
      if (!token) {
        throw new Error(
          "Authentication token is missing."
        );
      }

      try {
        const result =
          await getCollectionByIdApi(
            token,
            collectionId
          );

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to get collection."
          );
        }

        const collection =
          extractCollection(result);

        if (!collection) {
          throw new Error(
            "Server returned invalid collection data."
          );
        }

        return collection;
      } catch (error) {
        console.error(
          "Failed to get collection:",
          error
        );

        throw error;
      }
    },
    [token]
  );

  // --------------------------------------------------
  // UPDATE COLLECTION
  // --------------------------------------------------

  const updateCollection = useCallback(
    async (
      collectionId,
      collectionData
    ) => {
      if (!token) {
        throw new Error(
          "Authentication token is missing."
        );
      }

      try {
        const result =
          await updateCollectionApi(
            token,
            collectionId,
            collectionData
          );

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to update collection."
          );
        }

        const updatedCollection =
          extractCollection(result);

        if (!updatedCollection) {
          throw new Error(
            "Server returned invalid collection data."
          );
        }

        setCollections((prev) =>
          prev.map((collection) => {
            const currentId =
              collection?._id ||
              collection?.id;

            return String(currentId) ===
              String(collectionId)
              ? {
                  ...collection,
                  ...updatedCollection,
                }
              : collection;
          })
        );

        return updatedCollection;
      } catch (error) {
        console.error(
          "Failed to update collection:",
          error
        );

        throw error;
      }
    },
    [token]
  );

  // --------------------------------------------------
  // DELETE COLLECTION
  // --------------------------------------------------

  const deleteCollection = useCallback(
    async (collectionId) => {
      if (!token) {
        throw new Error(
          "Authentication token is missing."
        );
      }

      try {
        const result =
          await deleteCollectionApi(
            token,
            collectionId
          );

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Unable to delete collection."
          );
        }

        setCollections((prev) =>
          prev.filter((collection) => {
            const currentId =
              collection?._id ||
              collection?.id;

            return String(currentId) !==
              String(collectionId);
          })
        );

        return true;
      } catch (error) {
        console.error(
          "Failed to delete collection:",
          error
        );

        throw error;
      }
    },
    [token]
  );

  // --------------------------------------------------
  // ADD MEMORIES TO COLLECTION
  // --------------------------------------------------

  const addMemoryToCollection =
    useCallback(
      async (
        collectionId,
        memoryIds
      ) => {
        if (!token) {
          throw new Error(
            "Authentication token is missing."
          );
        }

        try {
          const result =
            await addMemoryToCollectionApi(
              token,
              collectionId,
              memoryIds
            );

          if (!result?.success) {
            throw new Error(
              result?.message ||
                "Unable to add memories."
            );
          }

          await refreshCollections();

          return result;
        } catch (error) {
          console.error(
            "Failed to add memories to collection:",
            error
          );

          throw error;
        }
      },
      [token, refreshCollections]
    );

  // --------------------------------------------------
  // REMOVE MEMORY FROM COLLECTION
  // --------------------------------------------------

  const removeMemoryFromCollection =
    useCallback(
      async (
        collectionId,
        memoryId
      ) => {
        if (!token) {
          throw new Error(
            "Authentication token is missing."
          );
        }

        try {
          const result =
            await removeMemoryFromCollectionApi(
              token,
              collectionId,
              memoryId
            );

          if (!result?.success) {
            throw new Error(
              result?.message ||
                "Unable to remove memory."
            );
          }

          return result;
        } catch (error) {
          console.error(
            "Failed to remove memory from collection:",
            error
          );

          throw error;
        }
      },
      [token]
    );

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  const value = useMemo(
    () => ({
      collections,
      loading,
      refreshCollections,
      createCollection,
      getCollectionById,
      updateCollection,
      deleteCollection,
      addMemoryToCollection,
      removeMemoryFromCollection,
    }),
    [
      collections,
      loading,
      refreshCollections,
      createCollection,
      getCollectionById,
      updateCollection,
      deleteCollection,
      addMemoryToCollection,
      removeMemoryFromCollection,
    ]
  );

  return (
    <CollectionContext.Provider
      value={value}
    >
      {children}
    </CollectionContext.Provider>
  );
}

