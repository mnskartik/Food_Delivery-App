import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";

/* ---------- Status Color ---------- */
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
    case "cancelled":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const cancelOrder = () => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            await api.delete(`/orders/${id}`);
            router.back();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  if (!order) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Details</Text>

      {/* Summary */}
      <View style={styles.card}>
        <Text style={styles.label}>Order ID</Text>
        <Text style={styles.value}>#{order._id.slice(-6)}</Text>

        <Text style={styles.label}>Total</Text>
        <Text style={styles.total}>₹{order.total}</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {order.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.card}>
        <Text style={styles.section}>Items</Text>
        {order.items.map((i: any) => (
          <Text key={i._id} style={styles.item}>
            • {i.menuItem.name} × {i.quantity}
          </Text>
        ))}
      </View>

      {/* Cancel */}
      {order.status === "pending" && (
        <Pressable style={styles.cancelBtn} onPress={cancelOrder}>
          <Text style={styles.cancelText}>Cancel Order</Text>
        </Pressable>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
  },
  total: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6C5CE7",
    marginTop: 4,
  },
  statusBadge: {
    marginTop: 10,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  section: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
    color: "#374151",
  },
  cancelBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
