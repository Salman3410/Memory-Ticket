import * as Location from "expo-location";

export const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    throw new Error("Location permission was denied");
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude, accuracy } = location.coords;

  let readableLocation = "";

  try {
    const results = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    const place = results?.[0];

    if (place) {
      const parts = [
        place.name,
        place.street,
        place.district,
        place.city,
        place.region,
        place.country,
      ].filter(Boolean);

      readableLocation = [...new Set(parts)].join(", ");
    }
  } catch (error) {
    console.log("Reverse geocoding error:", error);
  }

  return {
    latitude,
    longitude,
    accuracy: accuracy ?? null,
    readableLocation,
  };
};
