import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/AuthContext";

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // 🚫 Admins must NOT access tabs
  if (user?.role === "admin") {
    return <Redirect href="/(admin)/orders" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6C5CE7",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      }}
    >
      {/* 1️⃣ MENU */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "restaurant" : "restaurant-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 2️⃣ CART */}
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 3️⃣ ORDERS */}
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 4️⃣ PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
  name="order-details/[id]"
  options={{ href: null }}   // 👈 hides from tab bar
/>

    </Tabs>
  );
}
