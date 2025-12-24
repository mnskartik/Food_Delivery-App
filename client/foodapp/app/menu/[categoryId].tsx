import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import api from "../../api/axiosConfig";
import MenuItemCard from "../../components/MenuItemCard";
import { CartContext } from "../../hooks/CartContext";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function CategoryPage() {
  const { categoryId } = useLocalSearchParams();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const cartContext = useContext(CartContext);

  useEffect(() => {
    if (!categoryId) return;

    api
      .get(`/menu/category/${categoryId}`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("MENU FETCH ERROR:", err))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (!cartContext) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#6C5CE7" />
        <Text style={styles.helperText}>Preparing cart...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.helperText}>Loading delicious items 🍔</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyEmoji}>🍽️</Text>
        <Text style={styles.emptyText}>No items available</Text>
        <Text style={styles.emptySub}>
          Please check back later
        </Text>
      </View>
    );
  }

  const { addToCart } = cartContext;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Menu</Text>
        <Text style={styles.headerSub}>
          Choose your favourite items
        </Text>
      </View>

      {/* Items */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            onAddToCart={() => addToCart(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },

  /* Header */
  headerBox: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: "#F9F9F9",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },
  headerSub: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  /* Scroll */
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  /* States */
  center: {
    flex: 1,
    backgroundColor: "#F9F9F9",
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
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  emptySub: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
});
