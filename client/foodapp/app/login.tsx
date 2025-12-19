import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import api from "../api/axiosConfig";
import { useAuth } from "../hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); 

 

const handleLogin = async () => {
  
  try {
    const res = await api.post("/auth/login", { email, password });

    await login(res.data.token, res.data.user);

    if (res.data.user.role === "admin") {
      router.replace("/(admin)/orders"); // ✅ ADMIN UI
    } else {
      router.replace("/(tabs)/home"); // ✅ USER UI
    }
  } catch (err) {
    alert("Invalid email or password");
  }
};



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        {/* Email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Signup Link */}
        <Text
          style={styles.signupText}
          onPress={() => router.push("/signup")}
        >
          Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6C5CE7",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#6C5CE7",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: 15,
    textAlign: "center",
    color: "#666",
  },
  signupLink: {
    color: "#6C5CE7",
    fontWeight: "bold",
  },
});
