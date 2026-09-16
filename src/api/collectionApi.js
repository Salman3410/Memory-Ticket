import { apiRequest } from "./apiClient";

// --------------------------------------------------
// CREATE COLLECTION
// --------------------------------------------------

export async function createCollection(
  token,
  collectionData,
) {
  if (!collectionData?.name?.trim()) {
    return {
      success: false,
      message: "Collection name is required.",
    };
  }

  return apiRequest(
    "/collections",
    {
      method: "POST",
      token,
      body: {
        name: collectionData.name.trim(),
        description:
          collectionData.description?.trim() || "",
        coverMemoryId:
          collectionData.coverMemoryId || null,
      },
    },
  );
}

// --------------------------------------------------
// GET ALL COLLECTIONS
// --------------------------------------------------

export async function getCollections(
  token,
) {
  return apiRequest(
    "/collections",
    {
      method: "GET",
      token,
    },
  );
}

// --------------------------------------------------
// GET SINGLE COLLECTION
// --------------------------------------------------

export async function getCollectionById(
  token,
  collectionId,
) {
  if (!collectionId) {
    return {
      success: false,
      message: "Collection ID is required.",
    };
  }

  return apiRequest(
    `/collections/${collectionId}`,
    {
      method: "GET",
      token,
    },
  );
}

// --------------------------------------------------
// UPDATE COLLECTION
// --------------------------------------------------

export async function updateCollection(
  token,
  collectionId,
  collectionData,
) {
  if (!collectionId) {
    return {
      success: false,
      message: "Collection ID is required.",
    };
  }

  const body = {};

  if (
    collectionData?.name !== undefined
  ) {
    body.name =
      collectionData.name.trim();
  }

  if (
    collectionData?.description !==
    undefined
  ) {
    body.description =
      collectionData.description.trim();
  }

  if (
    collectionData?.coverMemoryId !==
    undefined
  ) {
    body.coverMemoryId =
      collectionData.coverMemoryId;
  }

  return apiRequest(
    `/collections/${collectionId}`,
    {
      method: "PUT",
      token,
      body,
    },
  );
}

// --------------------------------------------------
// DELETE COLLECTION
// --------------------------------------------------

export async function deleteCollection(
  token,
  collectionId,
) {
  if (!collectionId) {
    return {
      success: false,
      message: "Collection ID is required.",
    };
  }

  return apiRequest(
    `/collections/${collectionId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

// --------------------------------------------------
// ADD MEMORIES TO COLLECTION
// --------------------------------------------------

export async function addMemoryToCollection(
  token,
  collectionId,
  memoryIds,
) {
  if (!collectionId) {
    return {
      success: false,
      message: "Collection ID is required.",
    };
  }

  if (
    !Array.isArray(memoryIds) ||
    memoryIds.length === 0
  ) {
    return {
      success: false,
      message:
        "At least one memory is required.",
    };
  }

  return apiRequest(
    `/collections/${collectionId}/memories`,
    {
      method: "POST",
      token,
      body: {
        memoryIds,
      },
    },
  );
}

// --------------------------------------------------
// REMOVE MEMORY FROM COLLECTION
// --------------------------------------------------

export async function removeMemoryFromCollection(
  token,
  collectionId,
  memoryId,
) {
  if (!collectionId) {
    return {
      success: false,
      message: "Collection ID is required.",
    };
  }

  if (!memoryId) {
    return {
      success: false,
      message: "Memory ID is required.",
    };
  }

  return apiRequest(
    `/collections/${collectionId}/memories/${memoryId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

