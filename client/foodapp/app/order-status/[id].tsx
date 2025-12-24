import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../../api/axiosConfig";

/* ---------- helpers ---------- */
const statusConfig: Record<
  string,
  { color: string; label: string }
> = {
  pending: { color: "#F59E0B", label: "Pending" },
  preparing: { color: "#3B82F6", label: "Preparing" },
  out_for_delivery: { color: "#8B5CF6", label: "Out for delivery" },
  completed: { color: "#10B981", label: "Completed" },
};

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

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.loadingText}>
          Checking order status…
        </Text>
      </View>
    );
  }

  const current = statusConfig[status];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Status</Text>

      {/* Status Card */}
      <View style={styles.card}>
        <View
          style={[
            styles.badge,
            { backgroundColor: current?.color },
          ]}
        >
          <Text style={styles.badgeText}>
            {current?.label.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.subText}>
          Your order is currently
        </Text>
        <Text
          style={[
            styles.statusLabel,
            { color: current?.color },
          ]}
        >
          {current?.label}
        </Text>
      </View>

      {/* Info */}
      <Text style={styles.note}>
        Status updates automatically every few seconds 🚀
      </Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827",
  },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    elevation: 4,
    marginBottom: 24,
  },

  badge: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  subText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },

  note: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  /* Loading */
  center: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#374151",
  },
});
