import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../settingsStyles";

function AccountSection({
  navigation,
  onDeleteAccount,
}) {
  return (
    <>
      <Text style={styles.sectionTitle}>ACCOUNT</Text>

      <View style={styles.card}>
        {/* CHANGE PASSWORD */}
        <TouchableOpacity
          style={styles.accountRow}
          onPress={() => navigation.navigate("ChangePassword")}
          activeOpacity={0.7}
        >
          <View
            style={[styles.iconBox, styles.passwordIconBox]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#34345C"
            />
          </View>

          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>
              Change Password
            </Text>

            <Text style={styles.rowSubtitle}>
              Update your account password
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#A4A3AE"
          />
        </TouchableOpacity>

        <View style={styles.accountDivider} />

        {/* DELETE ACCOUNT */}
        <TouchableOpacity
          style={styles.accountRow}
          onPress={onDeleteAccount}
          activeOpacity={0.7}
        >
          <View
            style={[styles.iconBox, styles.deleteIconBox]}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color="#D9534F"
            />
          </View>

          <View style={styles.rowContent}>
            <Text
              style={[styles.rowTitle, styles.deleteTitle]}
            >
              Delete Account
            </Text>

            <Text style={styles.rowSubtitle}>
              Permanently delete your account and memories
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#A4A3AE"
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

export default AccountSection;

