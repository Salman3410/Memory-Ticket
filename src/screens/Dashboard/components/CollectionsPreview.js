import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "../dashboardStyles";

function CollectionsPreview({ collections, onPress }) {
  return (
    <View style={styles.collectionsGrid}>
      {collections.map((collection, index) => {
        const name =
          collection?.name || collection?.title || `Collection ${index + 1}`;

        const count =
          collection?.memoryCount ??
          collection?.memories?.length ??
          collection?.count ??
          0;

        return (
          <TouchableOpacity
            key={collection?.id || collection?._id || `${name}-${index}`}
            activeOpacity={0.8}
            onPress={() => onPress?.(collection)}
            style={styles.collectionCard}
          >
            <Text numberOfLines={1} style={styles.collectionName}>
              {name}
            </Text>

            <Text style={styles.collectionCount}>
              {count} {count === 1 ? "memory" : "memories"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default React.memo(CollectionsPreview);
