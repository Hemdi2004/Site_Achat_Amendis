import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Alert,
  Button, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getTenders, getDraftTenders } from "../../services/tenderService";
import { Tender } from "../../types/api";
import { Bid, submitBid } from "../../services/bidService";
import { useAuth } from "@/context/AuthContext";
import * as DocumentPicker from "expo-document-picker";
import { publishTender } from "../../services/tenderService";
import ProtectedRoute  from "@/components/ProtectedRoute";
import Screen from "@/components/Screen";

export default function TenderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [tender, setTender] = useState<Tender | null>(null);
  const [loading, setLoading] = useState(true);
  const [bid, setBid] = useState<Bid | null>(null);
  const [amount, setAmount] = useState("");
  const [technicalDocUrl, setTechnicalDocUrl] = useState<string | undefined>();
  const [financialDocUrl, setFinancialDocUrl] = useState<string | undefined>();

 useEffect(() => {
  const loadTender = async () => {
    try {
      // 1. Fetch published tenders
      const publishedTenders = await getTenders();
      let allTenders = [...publishedTenders];

      // 2. If user is an ADMIN, also fetch draft tenders
      if (user?.role?.toUpperCase() === "ADMIN") {
        try {
          const draftTenders = await getDraftTenders();
          allTenders = [...publishedTenders, ...draftTenders];
        } catch (draftErr) {
          console.warn("Failed to fetch draft tenders:", draftErr);
        }
      }

      // 3. Find the matching tender by ID
      const found = allTenders.find((item) => item.id === id);
      setTender(found ?? null);
    } catch (err) {
      console.error("Failed to load tender details:", err);
      setTender(null);
    } finally {
      setLoading(false);
    }
  };

  loadTender();
}, []);

const { user } = useAuth();
const [submitting, setSubmitting] = useState(false);


const pickDocument = async (
  type: "technical" | "financial"
) => {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
  });

  if (result.canceled) return;

  const file = result.assets[0];

  if (type === "technical") {
    setTechnicalDocUrl(file.name);
  } else {
    setFinancialDocUrl(file.name);
  }
};

const handleSubmitBid = async () => {
  const numericAmount = Number(amount);

  if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
    Alert.alert("Validation Error", "Please enter a valid bid amount.");
    return;
  }

  if (!technicalDocUrl) {
    Alert.alert(
      "Validation Error",
      "Please select a technical document."
    );
    return;
  }

  if (!financialDocUrl) {
    Alert.alert(
      "Validation Error",
      "Please select a financial document."
    );
    return;
  }

  try {
    setSubmitting(true);

    await submitBid(
      id,
      numericAmount,
      technicalDocUrl,
      financialDocUrl
    );

    Alert.alert("Success", "Bid submitted successfully.");

    setAmount("");
    setTechnicalDocUrl(undefined);
    setFinancialDocUrl(undefined);
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "Failed to submit bid.";

    Alert.alert("Bid submission failed", message);
  } finally {
    setSubmitting(false);
  }
};

const handlePublish = async () => {
  if (!tender) return;

  try {
    setSubmitting(true);

   {if (user?.role === 'ADMIN') {
    await publishTender(tender.id);
   }}
    Alert.alert("Success", "Tender published successfully.");

    setTender({
      ...tender,
      status: "PUBLISHED",
    });
  } catch (error: any) {
    Alert.alert(
      "Only Admin Can Publish A Tender!",
      error.response?.data?.message ||
        "Failed to publish tender."
    );
  } finally {
    setSubmitting(false);
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!tender) {
    return (
      <View style={styles.center}>
        <Text>Tender not found.</Text>
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
      <Text style={styles.title}>{tender.title}</Text>

      <Text style={styles.label}>Description</Text>
      <Text>{tender.description}</Text>

      <Text style={styles.label}>Status</Text>
      <Text>{tender.status}</Text>

      <Text style={styles.label}>Deadline</Text>
      <Text>
        {new Date(tender.deadline).toLocaleString()}
      </Text>
      {user?.role === "ADMIN" && tender.status === "DRAFT" && (
  <Button
    title={submitting ? "Publishing..." : "Publish Tender"}
    onPress={handlePublish}
    disabled={submitting}
  />
)}
{user?.role === "COMPANY" && tender.status === "PUBLISHED" && (
  <View style={styles.bidForm}>
    <Text style={styles.formTitle}>Submit a Bid</Text>

    <TextInput
      style={styles.input}
      placeholder="Bid Amount"
      keyboardType="numeric"
      value={amount}
      onChangeText={setAmount}
    />

    <Button
      title={
        technicalDocUrl
          ? `Technical: ${technicalDocUrl}`
          : "Select Technical PDF"
      }
      onPress={() => pickDocument("technical")}
    />

    <View style={{ height: 10 }} />

    <Button
      title={
        financialDocUrl
          ? `Financial: ${financialDocUrl}`
          : "Select Financial PDF"
      }
      onPress={() => pickDocument("financial")}
    />

    <View style={{ height: 15 }} />

    <Button
      title={submitting ? "Submitting..." : "Submit Bid"}
      onPress={handleSubmitBid}
      disabled={submitting}
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
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
  },
  bidForm: {
  marginTop: 30,
  padding: 16,
  borderWidth: 1,
  borderRadius: 10,
},
formTitle: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 15,
},
input: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 12,
  marginBottom: 15,
},
});