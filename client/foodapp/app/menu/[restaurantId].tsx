import { View, Text, StyleSheet, Image, FlatList, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState, useContext } from "react";
import api from "../../api/axiosConfig";
import { CartContext } from "../../hooks/CartContext";
import { Ionicons } from "@expo/vector-icons";

export default function RestaurantMenu() {
  const { restaurantId } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const { cart, addToCart } = useContext(CartContext);


  useEffect(() => {
    api.get(`/restaurants/${restaurantId}`).then(res => setRestaurant(res.data));
    api.get(`/menu/restaurant/${restaurantId}`).then(res => setMenu(res.data));
  }, []);

  if (!restaurant) return null;

  const grouped = menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F6F8" }}>
      
      {/* HEADER IMAGE */}
      <Image source={{ uri: restaurant.image }} style={styles.cover} />

      {/* RESTAURANT INFO */}
      <View style={styles.infoCard}>
        <Text style={styles.name}>{restaurant.name}</Text>

        <View style={styles.row}>
          <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.meta}>{restaurant.distance} km</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.meta}>{restaurant.deliveryTime} mins</Text>
        </View>

        <Text style={styles.tags}>
          {restaurant.categories.join(" • ")}
        </Text>
      </View>

      {/* MENU */}
      <FlatList
        data={Object.keys(grouped)}
        keyExtractor={i => i}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.section}>{item}</Text>

            {grouped[item].map((food: any) => (
              <View key={food._id} style={styles.foodCard}>
                <Image source={{ uri: food.image }} style={styles.foodImg} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodPrice}>₹{food.price}</Text>
                </View>

                <Pressable
  onPress={() => addToCart(food)}
  style={styles.addBtn}
>

                  <Text style={styles.addText}>ADD</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      />

      {/* FLOATING CART */}
      {cart.length > 0 && (
  <Pressable
    style={styles.cartBar}
    onPress={() => router.push("/(tabs)/cart")}
  >
    <Text style={styles.cartText}>
      {cart.length} items • ₹
      {cart.reduce((s, i) => s + i.item.price * i.qty, 0)}
    </Text>

    <Text style={styles.viewCart}>View Cart →</Text>
  </Pressable>
)}


    </View>
  );
}
const styles = StyleSheet.create({
  cover: {
    width: "100%",
    height: 220,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginTop: -30,
    marginHorizontal: 12,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  rating: {
    color: "#16A34A",
    fontWeight: "600",
  },
  dot: {
    marginHorizontal: 6,
    color: "#999",
  },
  meta: {
    color: "#555",
    fontSize: 13,
  },
  tags: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 13,
  },

  section: {
    marginTop: 20,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "bold",
  },

  foodCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  foodImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
  },
  foodPrice: {
    marginTop: 4,
    fontWeight: "bold",
    color: "#6C5CE7",
  },

  addBtn: {
    backgroundColor: "#6C5CE7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
  },

  cartBar: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#6C5CE7",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 10,
  },
  cartText: {
    color: "#fff",
    fontWeight: "bold",
  },
  viewCart: {
    color: "#fff",
    fontWeight: "bold",
  },
});
