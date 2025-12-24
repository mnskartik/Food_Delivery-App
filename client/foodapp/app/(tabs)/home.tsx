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
import { LinearGradient } from "expo-linear-gradient";

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What are you craving?</Text>
          <Text style={styles.subtitle}>
            Fresh food, delivered fast 🍔🍕
          </Text>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6C5CE7" />
            <Text style={styles.loadingText}>Loading categories...</Text>
          </View>
        )}

        {/* Categories */}
        {!loading &&
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

              {/* Gradient Overlay */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.85)"]}
                style={styles.gradient}
              />

              <View style={styles.overlayContent}>
                <Text style={styles.cardTitle}>{cat.name}</Text>
                <Text style={styles.explore}>Explore →</Text>
              </View>
            </Pressable>
          ))}

        {/* Empty */}
        {!loading && categories.length === 0 && (
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              No categories available 🍽️
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    padding: 16,
  },

  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: "#6B7280",
  },

  card: {
    height: 160,
    borderRadius: 20,
    marginBottom: 18,
    overflow: "hidden",
    backgroundColor: "#000",
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },

  image: {
    width: "100%",
    height: "100%",
  },

  gradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "60%",
  },

  overlayContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  explore: {
    marginTop: 4,
    fontSize: 14,
    color: "#E5E7EB",
  },

  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
