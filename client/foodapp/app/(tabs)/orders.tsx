import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import api from "../../api/axiosConfig";
import { router } from "expo-router";

interface Order {
  _id: string;
  status: string;
  total: number;
  createdAt: string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order[]>("/orders/history")
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading orders...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No orders yet 🍽️</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push(`/order-status/${item._id}`)}
          >
            <View>
              <Text style={styles.orderId}>
                Order #{item._id.slice(-6)}
              </Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.total}>₹{item.total}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C5CE7",
  },
  status: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    fontSize: 16,
    color: "#666",
  },
});
