import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import api from "../../../api/axiosConfig";
import { statusColor } from "../../../utils/statusColors";

export default function AdminOrderDetails() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/orders/${id}`).then((res) => {
      setOrder(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Order Summary */}
      <View style={styles.card}>
        <Text style={styles.title}>Order Details</Text>

        <Text style={styles.label}>Customer</Text>
        <Text style={styles.value}>{order.user.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{order.user.email}</Text>

        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.total}>₹{order.total}</Text>
      </View>

      {/* Status */}
      <View style={styles.card}>
        <Text style={styles.section}>Order Status</Text>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {order.status.replaceAll("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Items */}
      <View style={styles.card}>
        <Text style={styles.section}>Items Ordered</Text>

        {order.items.map((i: any) => (
          <View key={i._id} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {i.menuItem.name}
            </Text>
            <Text style={styles.itemQty}>
              × {i.quantity}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
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

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
  },

  section: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#111827",
  },

  label: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  total: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
    color: "#6C5CE7",
  },

  /* Items */
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  itemName: {
    fontSize: 15,
    color: "#111827",
  },
  itemQty: {
    fontSize: 15,
    fontWeight: "bold",
  },

  /* Status */
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
