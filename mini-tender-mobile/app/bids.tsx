import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  
} from "react-native";

import { Bid, getMyBids } from "../services/bidService";
import ProtectedRoute from "@/components/ProtectedRoute";
import Screen from "@/components/Screen";

export default function MyBidsScreen() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBids = async () => {
      try {
        const data = await getMyBids();
        setBids(data);
      } catch (error: any) {
        console.error(error);
        Alert.alert(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    loadBids();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (bids.length === 0) {
    return (
      <View style={styles.center}>
        <Text>You haven't submitted any bids yet.</Text>
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
            <View style={styles.container}>
      <Text style={styles.title}>My Bids</Text>

      <FlatList
        data={bids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Tender ID: {item.tenderId}</Text>
            <Text>Amount: {item.amount}</Text>
            <Text>
              Submitted:{" "}
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
      </ProtectedRoute>
  </KeyboardAvoidingView>
</Screen>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
  },
});