const CLOUDINARY_MARKER = "res.cloudinary.com";

const isCloudinaryUrl = (uri) => {
  return typeof uri === "string" && uri.includes(CLOUDINARY_MARKER);
};

const addTransformations = (uri, transformations) => {
  if (!isCloudinaryUrl(uri)) {
    return uri;
  }

  const uploadMarker = "/image/upload/";

  const uploadIndex = uri.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return uri;
  }

  const insertPosition = uploadIndex + uploadMarker.length;

  // Avoid applying transformations twice.
  const afterUpload = uri.slice(insertPosition);

  if (afterUpload.startsWith(transformations)) {
    return uri;
  }

  return uri.slice(0, insertPosition) + transformations + "/" + afterUpload;
};

// --------------------------------------------------
// MEMORY TICKET IMAGE
// --------------------------------------------------

export const getMemoryThumbnailUrl = (uri) => {
  if (!uri) {
    return uri;
  }

  return addTransformations(uri, "f_auto,q_auto,w_700");
};

// --------------------------------------------------
// MEMORY DETAILS IMAGE
// --------------------------------------------------

export const getMemoryDetailUrl = (uri) => {
  if (!uri) {
    return uri;
  }

  return addTransformations(uri, "f_auto,q_auto,w_1200");
};

// --------------------------------------------------
// FULLSCREEN IMAGE
// --------------------------------------------------

export const getMemoryViewerUrl = (uri) => {
  if (!uri) {
    return uri;
  }

  return addTransformations(uri, "f_auto,q_auto,w_1600");
};
