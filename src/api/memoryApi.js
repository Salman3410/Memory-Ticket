
import { apiRequest } from "./apiClient";

const perfNow = () =>
  globalThis.performance?.now?.() ?? Date.now();

const timedApiRequest = async (path, options = {}) => {
  const startedAt = perfNow();

  try {
    const result = await apiRequest(path, options);

    if (__DEV__) {
      console.log(
        `[Memento Perf] API ${options.method || "GET"} ${path}`,
        {
          durationMs: Number(
            (perfNow() - startedAt).toFixed(1),
          ),
          success: result?.success === true,
        },
      );
    }

    return result;
  } catch (error) {
    if (__DEV__) {
      console.log(
        `[Memento Perf] API ${options.method || "GET"} ${path}`,
        {
          durationMs: Number(
            (perfNow() - startedAt).toFixed(1),
          ),
          success: false,
          threw: true,
        },
      );
    }

    throw error;
  }
};

const appendJsonField = (formData, key, value) => {
  if (value === undefined || value === null) {
    return;
  }

  formData.append(
    key,
    typeof value === "string"
      ? value
      : JSON.stringify(value),
  );
};

const appendImage = (formData, uri, index) => {
  if (!uri) return;

  const filename =
    uri.split("/").pop() ||
    `memory-${Date.now()}-${index}.jpg`;

  const extension =
    filename.split(".").pop()?.split("?")[0]?.toLowerCase() ||
    "jpg";

  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };

  formData.append("images", {
    uri,
    name: filename,
    type: mimeTypes[extension] || "image/jpeg",
  });
};

export async function getMemories(token) {
  return timedApiRequest("/memories", {
    method: "GET",
    token,
  });
}

export async function getMemoryById(token, memoryId) {
  if (!memoryId) {
    return {
      success: false,
      message: "Memory ID is required.",
    };
  }

  return timedApiRequest(`/memories/${memoryId}`, {
    method: "GET",
    token,
  });
}

export async function createMemory(token, memory) {
  if (!memory) {
    return {
      success: false,
      message: "Memory data is required.",
    };
  }

  const formData = new FormData();

  formData.append("title", memory.title || "");
  formData.append("description", memory.description || "");
  formData.append(
    "date",
    memory.date || new Date().toISOString(),
  );
  formData.append("location", memory.location || "");
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
    memory.network || memory.environment?.network || null;

  appendJsonField(formData, "network", network);

  appendJsonField(
    formData,
    "tags",
    Array.isArray(memory.tags) ? memory.tags : [],
  );

  if (memory.ticketStyle !== undefined) {
    formData.append("ticketStyle", memory.ticketStyle);
  }

  if (memory.ticketAccent !== undefined) {
    formData.append("ticketAccent", memory.ticketAccent);
  }

  appendJsonField(
    formData,
    "ticketOptions",
    memory.ticketOptions,
  );

  formData.append(
    "isFavorite",
    String(
      memory.favorite === true ||
        memory.isFavorite === true,
    ),
  );

  const images = Array.isArray(memory.images)
    ? memory.images
    : memory.image
      ? [memory.image]
      : [];

  images
    .slice(0, 5)
    .forEach((uri, index) =>
      appendImage(formData, uri, index),
    );

  return timedApiRequest("/memories", {
    method: "POST",
    token,
    body: formData,
  });
}

export async function updateMemory(
  token,
  memoryId,
  memory,
) {
  if (!memoryId) {
    return {
      success: false,
      message: "Memory ID is required.",
    };
  }

  const formData = new FormData();

  if (memory.title !== undefined) {
    formData.append("title", memory.title);
  }

  if (memory.description !== undefined) {
    formData.append("description", memory.description);
  }

  if (memory.date !== undefined) {
    formData.append("date", memory.date);
  }

  if (memory.location !== undefined) {
    formData.append("location", memory.location);
  }

  if (memory.locationData !== undefined) {
    appendJsonField(
      formData,
      "locationData",
      memory.locationData,
    );
  }

  if (memory.network !== undefined) {
    appendJsonField(formData, "network", memory.network);
  }

  if (memory.tags !== undefined) {
    appendJsonField(
      formData,
      "tags",
      Array.isArray(memory.tags) ? memory.tags : [],
    );
  }

  if (memory.ticketStyle !== undefined) {
    formData.append("ticketStyle", memory.ticketStyle);
  }

  if (memory.ticketAccent !== undefined) {
    formData.append("ticketAccent", memory.ticketAccent);
  }

  if (memory.ticketOptions !== undefined) {
    appendJsonField(
      formData,
      "ticketOptions",
      memory.ticketOptions,
    );
  }

  if (
    memory.favorite !== undefined ||
    memory.isFavorite !== undefined
  ) {
    formData.append(
      "isFavorite",
      String(
        memory.favorite === true ||
          memory.isFavorite === true,
      ),
    );
  }

  const hasExistingImages =
    memory.existingImages !== undefined;

  const hasExistingImagePublicIds =
    memory.existingImagePublicIds !== undefined;

  if (hasExistingImages) {
    appendJsonField(
      formData,
      "existingImages",
      Array.isArray(memory.existingImages)
        ? memory.existingImages
        : [],
    );
  }

  if (hasExistingImagePublicIds) {
    appendJsonField(
      formData,
      "existingImagePublicIds",
      Array.isArray(memory.existingImagePublicIds)
        ? memory.existingImagePublicIds
        : [],
    );
  }

  const newImages = Array.isArray(memory.newImages)
    ? memory.newImages
    : [];

  let availableSlots = 5;

  if (hasExistingImages) {
    const existingImageCount = Array.isArray(
      memory.existingImages,
    )
      ? memory.existingImages.length
      : 0;

    availableSlots = Math.max(
      0,
      5 - existingImageCount,
    );
  }

  newImages
    .slice(0, availableSlots)
    .forEach((uri, index) =>
      appendImage(formData, uri, index),
    );

  return timedApiRequest(`/memories/${memoryId}`, {
    method: "PUT",
    token,
    body: formData,
  });
}

export async function deleteMemory(token, memoryId) {
  if (!memoryId) {
    return {
      success: false,
      message: "Memory ID is required.",
    };
  }

  return timedApiRequest(`/memories/${memoryId}`, {
    method: "DELETE",
    token,
  });
}

export async function toggleFavorite(
  token,
  memoryId,
  isFavorite,
) {
  if (!memoryId) {
    return {
      success: false,
      message: "Memory ID is required.",
    };
  }

  if (typeof isFavorite !== "boolean") {
    return {
      success: false,
      message: "Favorite state must be a boolean.",
    };
  }

  return timedApiRequest(
    `/memories/${memoryId}/favorite`,
    {
      method: "PATCH",
      token,
      body: { isFavorite },
    },
  );
}

export async function deleteAllMemories(token) {
  return timedApiRequest("/memories", {
    method: "DELETE",
    token,
  });
}
