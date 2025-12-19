import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../../api/axiosConfig";

export default function OrderStatus() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchStatus = () => {
      api
        .get<{ status: string }>(`/orders/${id}/status`)
        .then((res) => {
          setStatus(res.data.status);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.loadingText}>Fetching order status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>

      <View style={styles.statusCard}>
        <Text style={styles.statusText}>
          {status.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.note}>
        This page updates automatically 🚀
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#333",
  },
  statusCard: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  note: {
    fontSize: 14,
    color: "#666",
  },
  center: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
});
