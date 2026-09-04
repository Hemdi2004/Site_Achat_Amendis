import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: AppButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: "#2563EB",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});