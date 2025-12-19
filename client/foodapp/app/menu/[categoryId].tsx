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
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error("MENU FETCH ERROR:", err);
      })
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (!cartContext) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Loading cart...</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text style={styles.text}>Loading menu...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>No items available 🍽️</Text>
      </View>
    );
  }

  const { addToCart } = cartContext;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Menu</Text>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <MenuItemCard
            key={item._id}
            item={item}
            onAddToCart={() => addToCart(item, )}
          />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9", // force light background
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: "#333",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
