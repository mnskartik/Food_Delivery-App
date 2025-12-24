import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import api from "../../api/axiosConfig";
import { router } from "expo-router";

/* ---------------- TYPES ---------------- */
interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
}

/* ---------------- HELPERS ---------------- */
const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "#F59E0B";
    case "preparing":
      return "#3B82F6";
    case "out_for_delivery":
      return "#8B5CF6";
    case "completed":
      return "#10B981";
    default:
      return "#6B7280";
  }
};

/* ---------------- SCREEN ---------------- */
export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order[]>("/orders/history")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.helperText}>Fetching your orders…</Text>
      </View>
    );
  }

  /* ---------- Empty ---------- */
  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyEmoji}>🍽️</Text>
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySub}>
          Your delicious orders will appear here
        </Text>
      </View>
    );
  }

  /* ---------- List ---------- */
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.pressed,
            ]}
            onPress={() =>
              router.push(`/order-status/${item._id}`)
            }
          >
            {/* Left */}
            <View>
              <Text style={styles.orderId}>
                Order #{item._id.slice(-6)}
              </Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>

            {/* Right */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.total}>₹{item.total}</Text>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status.replaceAll("_", " ").toUpperCase()}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
  },

  /* Card */
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },

  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C5CE7",
    marginBottom: 6,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  /* States */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  helperText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B7280",
  },

  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  emptySub: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
