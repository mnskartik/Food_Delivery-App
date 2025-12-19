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

  const {
    cart,
    clearCart,
    increaseQty,
    decreaseQty,
  } = cartContext;

  const total = cart.reduce(
    (sum: number, i: CartItem) => sum + i.item.price * i.qty,
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
      Alert.alert("Success", "Order placed successfully 🍽️");
    } catch {
      Alert.alert("Error", "Failed to place order");
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Your cart is empty 🛒</Text>
        <Text style={styles.emptySubtitle}>
          Add items from the menu to get started
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>

      {/* ✅ CORRECT FlatList */}
      <FlatList
        data={cart}
        keyExtractor={(item) => item.item._id}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.item.name}</Text>
              <Text style={styles.price}>
                ₹{item.item.price * item.qty}
              </Text>
            </View>

            {/* Quantity Controls */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => decreaseQty(item.item._id)}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => increaseQty(item.item._id)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>₹{total}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={placeOrder}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },

  /* Cart item card */
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  qtyText: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6C5CE7",
  },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C5CE7",
  },
  button: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 14,
    borderRadius: 10,
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
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  qtyContainer: {
  flexDirection: "row",
  alignItems: "center",
},
qtyBtn: {
  width: 32,
  height: 32,
  borderRadius: 8,
  backgroundColor: "#6C5CE7",
  justifyContent: "center",
  alignItems: "center",
},
qtyBtnText: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "bold",
},
qtyValue: {
  marginHorizontal: 10,
  fontSize: 16,
  fontWeight: "600",
  color: "#333",
},

});
