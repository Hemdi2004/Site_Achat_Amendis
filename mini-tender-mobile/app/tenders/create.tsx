import { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";

import { createTender } from "../../services/tenderService";
import ProtectedRoute  from "@/components/ProtectedRoute";
import Screen from "@/components/Screen";

export default function CreateTenderScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !description || !deadline) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    const parsedDate = new Date(deadline);

    if (Number.isNaN(parsedDate.getTime())) {
      Alert.alert(
        "Validation Error",
        "Use this format: YYYY-MM-DD"
      );
      return;
    }

    try {
      setLoading(true);

      await createTender({
        title,
        description,
        deadline: parsedDate.toISOString(),
      });

      Alert.alert("Success", "Tender created successfully.");

      router.replace("/tenders");
    } catch (error: any) {
      Alert.alert(
        "Creation Failed",
        error.response?.data?.message ||
          "Failed to create tender."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
      {/* existing form */}
          <ProtectedRoute>
          <View style={styles.container}>
      <Text style={styles.title}>Create Tender</Text>

      <TextInput
        style={styles.input}
        placeholder="Tender title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, styles.description]}
        placeholder="Tender description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
      />

      <Button
        title={loading ? "Creating..." : "Create Tender"}
        onPress={handleCreate}
        disabled={loading}
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  description: {
    minHeight: 100,
    textAlignVertical: "top",
  },
});