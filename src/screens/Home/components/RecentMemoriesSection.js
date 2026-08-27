import { View, Text, TouchableOpacity } from "react-native";
import MemoryTicketHorizontal from "../../../components/MemoryTicket/MemoryTicketHorizontal";
import styles from "../homeStyles";

function RecentMemoriesSection({ recentMemories, loading, navigation }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionEyebrow}>YOUR COLLECTION</Text>

          <Text style={styles.sectionTitle}>Recent memories</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Memories")}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>VIEW ALL</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <Text style={styles.loadingText}>Loading memories...</Text>
        </View>
      ) : recentMemories.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            {/* Empty state will be extracted next */}
          </View>

          <Text style={styles.emptyTitle}>Nothing here yet</Text>

          <Text style={styles.emptyDescription}>
            Your captured memories will appear here.
          </Text>

          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate("Create")}
            activeOpacity={0.85}
          >
            <Text style={styles.emptyButtonText}>CREATE ONE</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.recentList}>
          {recentMemories.map((memory) => (
            <MemoryTicketHorizontal
              key={memory.id}
              memory={memory}
              onPress={() =>
                navigation.navigate("MemoryDetails", {
                  memoryId: memory.id,
                })
              }
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default RecentMemoriesSection;
