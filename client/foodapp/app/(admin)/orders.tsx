import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { router } from "expo-router";
import { statusColor } from "../../utils/statusColors";

const STATUSES = [
  "pending",
  "preparing",
  "out_for_delivery",
  "completed",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/admin/orders${status ? `?status=${status}` : ""}`)
      .then((res) => setOrders(res.data));
  }, [status]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    await api.put(`/orders/${orderId}/status`, {
      status: newStatus,
    });

    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      )
    );

    setOpenDropdown(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Orders</Text>
      <Text style={styles.subHeader}>
        Manage and track all customer orders
      </Text>

      {/* Status Filters */}
      <View style={styles.filters}>
        {STATUSES.map((s) => (
          <Pressable
            key={s}
            onPress={() => setStatus(s === status ? "" : s)}
            style={[
              styles.filterChip,
              status === s && styles.activeChip,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                status === s && styles.activeText,
              ]}
            >
              {s.replaceAll("_", " ")}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Orders */}
      <FlatList
        data={orders}
        keyExtractor={(o) => o._id}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header Row */}
            <View style={styles.row}>
              <View>
                <Text style={styles.user}>
                  👤 {item.user.name}
                </Text>
                <Text style={styles.orderId}>
                  Order #{item._id.slice(-6)}
                </Text>
              </View>

              <View style={{ position: "relative" }}>
                <Pressable
                  onPress={() =>
                    setOpenDropdown(
                      openDropdown === item._id
                        ? null
                        : item._id
                    )
                  }
                  style={[
                    styles.badge,
                    {
                      backgroundColor: statusColor(
                        item.status
                      ),
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.status
                      .replaceAll("_", " ")
                      .toUpperCase()}
                  </Text>
                </Pressable>

                {/* Dropdown */}
                {openDropdown === item._id && (
                  <View style={styles.dropdown}>
                    {STATUSES.map((s) => (
                      <Pressable
                        key={s}
                        onPress={() =>
                          updateStatus(item._id, s)
                        }
                        style={styles.dropdownRow}
                      >
                        <Text style={styles.dropdownItem}>
                          {s.replaceAll("_", " ")}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.total}>
                ₹{item.total}
              </Text>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname:
                      "/(admin)/order-details/[id]",
                    params: { id: item._id },
                  })
                }
              >
                <Text style={styles.view}>
                  View Details →
                </Text>
              </Pressable>
            </View>
          </View>
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
    color: "#111827",
  },
  subHeader: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 14,
  },

  /* Filters */
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  activeChip: {
    backgroundColor: "#6C5CE7",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textTransform: "capitalize",
  },
  activeText: {
    color: "#fff",
  },

  /* Card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  user: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  orderId: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  /* Badge */
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  /* Dropdown */
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 14,
    width: 180,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 100,
  },
  dropdownRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItem: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textTransform: "capitalize",
  },

  /* Footer */
  footer: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  view: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6C5CE7",
  },
});
