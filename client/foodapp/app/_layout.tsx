import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { CartProvider } from "../hooks/CartContext";
import { LanguageProvider } from "../hooks/LanguageContext";
import { AuthProvider } from "../hooks/AuthContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
     <LanguageProvider>
    <CartProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Landing Page */}
          <Stack.Screen name="index" options={{ headerShown: false }} />

          {/* Auth */}
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />

          {/* Main App */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </CartProvider>
    </LanguageProvider>
    </AuthProvider>
  );
}
