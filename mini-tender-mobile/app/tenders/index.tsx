import { useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { getTenders } from "@/services/tenderService";
import { Tender } from "@/types/api";
import { router, useFocusEffect } from "expo-router";
import { getDraftTenders } from "@/services/tenderService";
import ProtectedRoute  from "@/components/ProtectedRoute";
import AppButton from "@/components/AppButton";
import Screen from "@/components/Screen";


export default function TendersScreen() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [error, setError] = useState("");

  const { user, logout, loading } = useAuth();

useFocusEffect(
  useCallback(() => {
    const loadTenders = async () => {
      try {
        const publishedTenders = await getTenders();
        let allTenders = [...publishedTenders];

        if (user?.role?.toUpperCase() === "ADMIN") {
          const draftTenders = await getDraftTenders();
          allTenders = [...publishedTenders, ...draftTenders];
        }

        setTenders(allTenders);
      } catch (error: any) {
        console.log("--- BACKEND ERROR DETAILS ---");
        console.log("Status Code:", error.response?.status);
        console.log("Response Data:", JSON.stringify(error.response?.data, null, 2));
      }
    };

    loadTenders();
  }, [user?.role])
);
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading tenders...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (

    <Screen>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
      {/* existing form */}
          <ProtectedRoute>
         <View style={styles.mainContainer}>
      {/* Header section with User Info and Logout */}
      <View style={styles.header}>
        <Text style={styles.welcome} numberOfLines={1}>
          Logged in as: {user?.email}
        </Text>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
      {user?.role === 'COMPANY' && (<Text style={styles.title}>Recent Tenders ({tenders.length})</Text> )}
      {user?.role === 'ADMIN' && (<Text style={styles.title}>Manage Tenders({tenders.length})</Text> )}
      
  {/* 👇 PLACE IT HERE 👇 */}
    {user?.role === "COMPANY" && (
      <View style={{ marginBottom: 15 }}>
        <AppButton
          title="Create Tender"
           onPress={() => router.push("/tenders/create")}
        />
      </View>
    )}

      {/* Tender List with flex: 1 */}
      <FlatList
        data={tenders}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/tenders/[id]",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardStatus}>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tenders found in database.</Text>
        }
      />

      {/* Bottom Action Section */}
      {user?.role === "COMPANY" && (
      <View style={styles.footer}>
        <Button
          onPress={() => router.push("/bids")}
          title="See My Bids"
          color="#841584"
        />
      </View>
    )}
    </View>
    </ProtectedRoute>
  </KeyboardAvoidingView>
</Screen>

 
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  welcome: {
    flex: 1,
    marginRight: 10,
    fontSize: 14,
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0f172a",
  },
  list: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 10,
    color: "#475569",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 10,
  },
  cardStatus: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb",
  },
  emptyText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 20,
  },
  footer: {
    paddingTop: 10,
  },
});