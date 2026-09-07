import { apiRequest } from "./apiClient";

// --------------------------------------------------
// APPEND JSON FIELD
// --------------------------------------------------

const appendJsonField = (
  formData,
  key,
  value,
) => {
  if (
    value === undefined ||
    value === null
  ) {
    return;
  }

  formData.append(
    key,
    typeof value === "string"
      ? value
      : JSON.stringify(value),
  );
};

// --------------------------------------------------
// APPEND IMAGE
// --------------------------------------------------

const appendImage = (
  formData,
  uri,
  index,
) => {
  if (!uri) {
    return;
  }

  const filename =
    uri.split("/").pop() ||
    `memory-${Date.now()}-${index}.jpg`;

  const extension =
    filename
      .split(".")
      .pop()
      ?.split("?")[0]
      ?.toLowerCase() || "jpg";

  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };

  formData.append(
    "images",
    {
      uri,
      name: filename,
      type:
        mimeTypes[extension] ||
        "image/jpeg",
    },
  );
};

// --------------------------------------------------
// GET ALL MEMORIES
// --------------------------------------------------

export async function getMemories(
  token,
) {
  return apiRequest(
    "/memories",
    {
      method: "GET",
      token,
    },
  );
}

// --------------------------------------------------
// GET SINGLE MEMORY
// --------------------------------------------------

export async function getMemoryById(
  token,
  memoryId,
) {
  if (!memoryId) {
    return {
      success: false,
      message:
        "Memory ID is required.",
    };
  }

  return apiRequest(
    `/memories/${memoryId}`,
    {
      method: "GET",
      token,
    },
  );
}

// --------------------------------------------------
// CREATE MEMORY
// --------------------------------------------------

export async function createMemory(
  token,
  memory,
) {
  if (!memory) {
    return {
      success: false,
      message:
        "Memory data is required.",
    };
  }

  const formData =
    new FormData();

  formData.append(
    "title",
    memory.title || "",
  );

  formData.append(
    "description",
    memory.description || "",
  );

  formData.append(
    "date",
    memory.date ||
      new Date().toISOString(),
  );

  formData.append(
    "location",
    memory.location || "",
  );

  formData.append(
    "clientMemoryId",
    memory.clientMemoryId || "",
  );

  appendJsonField(
    formData,
    "locationData",
    memory.locationData,
  );

  const network =
    memory.network ||
    memory.environment?.network ||
    null;

  appendJsonField(
    formData,
    "network",
    network,
  );

  formData.append(
    "isFavorite",
    String(
      memory.favorite === true ||
      memory.isFavorite === true,
    ),
  );

  const images =
    Array.isArray(
      memory.images,
    )
      ? memory.images
      : memory.image
        ? [memory.image]
        : [];

  images
    .slice(0, 5)
    .forEach(
      (uri, index) => {
        appendImage(
          formData,
          uri,
          index,
        );
      },
    );

  return apiRequest(
    "/memories",
    {
      method: "POST",
      token,
      body: formData,
    },
  );
}

// --------------------------------------------------
// UPDATE MEMORY
// --------------------------------------------------

export async function updateMemory(
  token,
  memoryId,
  memory,
) {
  if (!memoryId) {
    return {
      success: false,
      message:
        "Memory ID is required.",
    };
  }

  const formData =
    new FormData();

  if (
    memory.title !== undefined
  ) {
    formData.append(
      "title",
      memory.title,
    );
  }

  if (
    memory.description !==
    undefined
  ) {
    formData.append(
      "description",
      memory.description,
    );
  }

  if (
    memory.date !== undefined
  ) {
    formData.append(
      "date",
      memory.date,
    );
  }

  if (
    memory.location !==
    undefined
  ) {
    formData.append(
      "location",
      memory.location,
    );
  }

  if (
    memory.locationData !==
    undefined
  ) {
    appendJsonField(
      formData,
      "locationData",
      memory.locationData,
    );
  }

  if (
    memory.network !==
    undefined
  ) {
    appendJsonField(
      formData,
      "network",
      memory.network,
    );
  }

  if (
    memory.favorite !==
      undefined ||
    memory.isFavorite !==
      undefined
  ) {
    formData.append(
      "isFavorite",
      String(
        memory.favorite === true ||
        memory.isFavorite === true,
      ),
    );
  }

  const existingImages =
    Array.isArray(
      memory.existingImages,
    )
      ? memory.existingImages
      : [];

  const existingImagePublicIds =
    Array.isArray(
      memory.existingImagePublicIds,
    )
      ? memory.existingImagePublicIds
      : [];

  appendJsonField(
    formData,
    "existingImages",
    existingImages,
  );

  appendJsonField(
    formData,
    "existingImagePublicIds",
    existingImagePublicIds,
  );

  const newImages =
    Array.isArray(
      memory.newImages,
    )
      ? memory.newImages
      : [];

  const availableSlots =
    Math.max(
      0,
      5 - existingImages.length,
    );

  newImages
    .slice(0, availableSlots)
    .forEach(
      (uri, index) => {
        appendImage(
          formData,
          uri,
          index,
        );
      },
    );

  return apiRequest(
    `/memories/${memoryId}`,
    {
      method: "PUT",
      token,
      body: formData,
    },
  );
}

// --------------------------------------------------
// DELETE MEMORY
// --------------------------------------------------

export async function deleteMemory(
  token,
  memoryId,
) {
  if (!memoryId) {
    return {
      success: false,
      message:
        "Memory ID is required.",
    };
  }

  return apiRequest(
    `/memories/${memoryId}`,
    {
      method: "DELETE",
      token,
    },
  );
}

// --------------------------------------------------
// TOGGLE FAVORITE
// --------------------------------------------------

export async function toggleFavorite(
  token,
  memoryId,
) {
  if (!memoryId) {
    return {
      success: false,
      message:
        "Memory ID is required.",
    };
  }

  return apiRequest(
    `/memories/${memoryId}/favorite`,
    {
      method: "PATCH",
      token,
    },
  );
}

// --------------------------------------------------
// DELETE ALL MEMORIES
// --------------------------------------------------

export async function deleteAllMemories(
  token,
) {
  return apiRequest(
    "/memories",
    {
      method: "DELETE",
      token,
    },
  );
}

