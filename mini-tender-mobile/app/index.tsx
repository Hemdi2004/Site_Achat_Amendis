import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  // 1. While checking SecureStore on startup, show a loader
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. If a valid token/user was restored from SecureStore, go to Tenders
  if (user) {
    return <Redirect href="/tenders" />;
  }

  // 3. Otherwise, send the user to the Login screen
  return <Redirect href="/login" />;
}