import { Tabs , Redirect } from "expo-router";
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
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "home":
              iconName = focused ? "restaurant" : "restaurant-outline";
              break;
            case "cart":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "orders":
              iconName = focused ? "receipt" : "receipt-outline";
              break;
            case "profile":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#6C5CE7",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    />
  );
}
