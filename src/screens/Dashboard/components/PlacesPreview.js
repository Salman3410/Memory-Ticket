import React from "react";
import { Text, View } from "react-native";

import { styles } from "../dashboardStyles";

function PlacesPreview({ places }) {
  return (
    <View style={styles.placesCard}>
      {places.map((place, index) => (
        <View
          key={`${place.name}-${index}`}
          style={[
            styles.placeRow,
            index === places.length - 1 && styles.placeRowLast,
          ]}
        >
          <View style={styles.placeTextWrapper}>
            <Text numberOfLines={1} style={styles.placeName}>
              {place.name}
            </Text>
          </View>

          <Text style={styles.placeCount}>{place.count}</Text>
        </View>
      ))}
    </View>
  );
}

export default React.memo(PlacesPreview);
