import { Stack, Redirect } from "expo-router";
import { useAuth } from "../../hooks/AuthContext";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // 🚫 Block non-admins
  if (!user || user.role !== "admin") {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // 🔥 removes "(admin)" & "orders" headers
      }}
    />
  );
}
