import {
  View,
  Text,
  StyleSheet,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/axiosConfig";
import { useLanguage } from "../../hooks/LanguageContext";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function Profile() {
  const { language, setLanguage } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<User>("/users/me")
      .then((res) => setUser(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C5CE7" />
      </View>
    );
  }
  const toggleLanguage = async (val: boolean) => {
  const newLang = val ? "zu" : "en";

  setLanguage(newLang);

  await api.put("/users/language", {
    language: newLang,
  });
};
const logout = async () => {
  await AsyncStorage.removeItem("token");
  router.replace("/login");
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* User Card */}
      <View style={styles.card}>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>
          Role: {user?.role.toUpperCase()}
        </Text>
      </View>

      {/* Language Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App Language</Text>

        <View style={styles.langRow}>
          <Text style={styles.langText}>
            {language === "en" ? "English" : "Zulu"}
          </Text>

         <Switch
  value={language === "zu"}
  onValueChange={toggleLanguage}
  trackColor={{ false: "#ccc", true: "#6C5CE7" }}
/>

        </View>

        <Text style={styles.note}>
          Language applies to the entire app 🌍
        </Text>
      </View>
      {/* Logout */}
<TouchableOpacity style={styles.logoutBtn} onPress={logout}>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  role: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#6C5CE7",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  langRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  langText: {
    fontSize: 16,
    color: "#333",
  },
  note: {
    marginTop: 8,
    fontSize: 12,
    color: "#777",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
  marginTop: 20,
  backgroundColor: "#ff4d4d",
  padding: 14,
  borderRadius: 10,
  alignItems: "center",
},
logoutText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},

});
