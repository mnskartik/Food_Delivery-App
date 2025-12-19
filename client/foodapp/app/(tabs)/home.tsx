import { Stack } from "expo-router";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { router } from "expo-router";
import { Image } from "react-native";

const categoryImages: Record<string, string> = {
  Burgers: "https://images.unsplash.com/photo-1550547660-d9450f859349",
  Pizza: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143",
  Drinks: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97",
  Desserts: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f",
};


interface Category {
  _id: string;
  name: string;
}

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Category[]>("/menu/categories")
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Menu" }} />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6C5CE7" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        ) : (
          categories.map((cat) => (
           <Pressable
    key={cat._id}
    style={({ pressed }) => [
      styles.card,
      pressed && styles.pressed,
    ]}
    onPress={() => router.push(`/menu/${cat._id}`)}
  >
    <Image
      source={{ uri: categoryImages[cat.name] }}
      style={styles.image}
    />

    <View style={styles.overlay}>
      <Text style={styles.cardText}>{cat.name}</Text>
      <Text style={styles.subText}>Explore →</Text>
    </View>
  </Pressable>
          ))
        )}

        {!loading && categories.length === 0 && (
          <Text style={styles.emptyText}>No categories available 🍽️</Text>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 16,
  },
   center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  card: {
    height: 140,
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#000",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  image: {
    width: "100%",
    height: "100%",
  },
cardText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
   subText: {
    marginTop: 4,
    fontSize: 14,
    color: "#ddd",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  
});
