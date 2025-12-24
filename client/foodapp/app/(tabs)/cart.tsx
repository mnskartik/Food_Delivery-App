import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useContext } from "react";
import { CartContext } from "../../hooks/CartContext";
import api from "../../api/axiosConfig";

interface CartItem {
  item: {
    _id: string;
    name: string;
    price: number;
  };
  qty: number;
}

export default function Cart() {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Loading cart...</Text>
      </View>
    );
  }

  const { cart, clearCart, increaseQty, decreaseQty } =
    cartContext;

  const total = cart.reduce(
    (sum: number, i: CartItem) =>
      sum + i.item.price * i.qty,
    0
  );

  const placeOrder = async () => {
    try {
      const payload = {
        items: cart.map((c: CartItem) => ({
          menuItem: c.item._id,
          quantity: c.qty,
        })),
        total,
      };

      await api.post("/orders", payload);
      clearCart();
      Alert.alert("Success 🎉", "Order placed successfully");
    } catch {
      Alert.alert("Error", "Failed to place order");
    }
  };

  /* ---------- Empty cart ---------- */
  if (cart.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Your cart is empty 🛒</Text>
        <Text style={styles.emptySubtitle}>
          Add some delicious items to continue
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.item._id}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Item info */}
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>
                {item.item.name}
              </Text>
              <Text style={styles.itemPrice}>
                ₹{item.item.price} × {item.qty}
              </Text>
            </View>

            {/* Quantity controls */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() =>
                  decreaseQty(item.item._id)
                }
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>
                {item.qty}
              </Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() =>
                  increaseQty(item.item._id)
                }
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>₹{total}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={placeOrder}
        >
          <Text style={styles.buttonText}>
            Place Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
  },

  /* Cart item */
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#6B7280",
  },

  /* Quantity */
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  qtyValue: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 16,
    color: "#6B7280",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6C5CE7",
  },
  button: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  /* Empty / loading */
  center: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#374151",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});
