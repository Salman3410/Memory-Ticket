import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "./profileMenuStyles";

function ProfileMenu({ title, items }) {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>

      <View style={styles.menuContainer}>
        {items.map((item, index) => (
          <React.Fragment key={item.title}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={19} color="#34345C" />
              </View>

              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>

                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color="#A4A3AE" />
            </TouchableOpacity>

            {index < items.length - 1 && <View style={styles.menuDivider} />}
          </React.Fragment>
        ))}
      </View>
    </>
  );
}

export default ProfileMenu;
