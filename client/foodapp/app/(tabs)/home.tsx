import { Stack, router } from "expo-router";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  TextInput,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import Slider from "@react-native-community/slider";

import { useEffect, useState, useContext } from "react";
import api from "../../api/axiosConfig";
import { CartContext } from "../../hooks/CartContext";

/* ---------------- TYPES ---------------- */
interface Restaurant {
  _id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: number;
  isVeg: boolean;
  categories: string[];
}

export default function HomeScreen() {
  const cartContext = useContext(CartContext);
  const cartCount = cartContext?.cart.length || 0;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, [search, rating, vegOnly, distance]);

  const fetchRestaurants = async () => {
    const params: any = {};

    if (search) params.search = search;
    if (rating) params.rating = rating;
    if (vegOnly) params.veg = true;
    if (distance) params.distance = distance;

    const res = await api.get("/restaurants", { params });
    setRestaurants(res.data);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* ---------------- HEADER ---------------- */}
        <View style={styles.header}>
          <Text style={styles.title}>Discover Food</Text>

          <Pressable
            style={styles.cartBtn}
            onPress={() => router.push("/(tabs)/cart")}
          >
            <Ionicons name="cart-outline" size={26} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* ---------------- SEARCH ---------------- */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            placeholder="Search restaurants..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* ---------------- FILTERS ---------------- */}
        <View style={styles.filters}>

  {/* Rating Filter */}
  <View style={styles.filterBlock}>
    <Text style={styles.filterLabel}>
      ⭐ Minimum Rating: {rating ?? "Any"}
    </Text>
    <Slider
      minimumValue={1}
      maximumValue={5}
      step={0.5}
      value={rating || 1}
      onValueChange={val => setRating(val)}
      minimumTrackTintColor="#6C5CE7"
      maximumTrackTintColor="#D1D5DB"
    />
  </View>

  {/* Distance Filter */}
  <View style={styles.filterBlock}>
    <Text style={styles.filterLabel}>
      📍 Distance: {distance ? `${distance} km` : "Any"}
    </Text>
    <Slider
      minimumValue={1}
      maximumValue={20}
      step={1}
      value={distance || 20}
      onValueChange={val => setDistance(val)}
      minimumTrackTintColor="#6C5CE7"
      maximumTrackTintColor="#D1D5DB"
    />
  </View>

  {/* Veg Toggle */}
  <View style={styles.vegToggle}>
    <Text style={styles.filterLabel}>🥗 Veg only</Text>
    <Switch value={vegOnly} onValueChange={setVegOnly} />
  </View>

</View>

        {/* ---------------- RESTAURANTS ---------------- */}
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push(`/menu/${item._id}`)
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />

              <View style={styles.cardBody}>
                <View style={styles.rowBetween}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.rating}>
                    ⭐ {item.rating}
                  </Text>
                </View>

                <Text style={styles.meta}>
                  ⏱ {item.deliveryTime} • 📍{" "}
                  {item.distance} km
                </Text>

                <Text style={styles.categories}>
                  {item.categories.join(" • ")}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },

  cartBtn: { position: "relative" },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: "#fff", fontSize: 11 },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },

  filters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  filterChip: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  activeChip: {
    backgroundColor: "#6C5CE7",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
  },
  vegToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },
  image: {
    height: 150,
    width: "100%",
  },
  cardBody: {
    padding: 14,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
  },
  meta: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },
  categories: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B5563",
  },
  filterBlock: {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 12,
  marginBottom: 10,
},

filterLabel: {
  fontSize: 13,
  fontWeight: "600",
  marginBottom: 6,
  color: "#374151",
},

});
