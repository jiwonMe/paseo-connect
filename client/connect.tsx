import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";

export function ConnectScreen() {
  const [ghCode, setGhCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("");

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Paseo Connect</Text>

      {/* Pairing */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>1. Pairing</Text>
        <Pressable
          style={{ backgroundColor: "#0969da", padding: 12, borderRadius: 8, marginTop: 8 }}
          onPress={() => setStatus("Run: paseo daemon pair --relay")}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Show Pairing Link / QR</Text>
        </Pressable>
        {status ? <Text style={{ marginTop: 8 }}>{status}</Text> : null}
      </View>

      {/* GitHub */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>2. GitHub CLI</Text>
        <Pressable
          style={{ backgroundColor: "#24292f", padding: 12, borderRadius: 8, marginTop: 8 }}
          onPress={() => {
            setGhCode("XXXX-XXXX");
            setStatus("Run in shell: gh auth login --web");
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Start GitHub Device Code</Text>
        </Pressable>
        {ghCode && (
          <Text style={{ marginTop: 8 }}>
            Code: {ghCode}\nGo to https://github.com/login/device
          </Text>
        )}
      </View>

      {/* API Keys */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>3. API Keys</Text>
        <TextInput
          placeholder="ANTHROPIC_API_KEY or OPENAI_API_KEY"
          value={apiKey}
          onChangeText={setApiKey}
          style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 6, marginTop: 8 }}
        />
        <Pressable
          style={{ backgroundColor: "#1a7f37", padding: 12, borderRadius: 8, marginTop: 8 }}
          onPress={() => setStatus("Key saved (will be written to /home/paseo/.paseo/.env.auth)")}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Save API Key</Text>
        </Pressable>
      </View>

      <Text style={{ color: "#666", fontSize: 12, marginTop: 20 }}>
        This is a scaffold. Full RPC integration and OAuth forms coming next.
      </Text>
    </ScrollView>
  );
}
