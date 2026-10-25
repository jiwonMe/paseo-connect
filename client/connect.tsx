import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useRpc } from "@getpaseo/plugin/client";
import {
  getConnectionInfo,
  startPairing,
  startGitHubDevice,
  saveApiKey,
} from "../shared/connection";

export function ConnectScreen() {
  const getInfo = useRpc(getConnectionInfo);
  const pair = useRpc(startPairing);
  const gh = useRpc(startGitHubDevice);
  const save = useRpc(saveApiKey);

  const [info, setInfo] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [key, setKey] = useState("");

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>Paseo Connect</Text>

      <Pressable
        style={{ backgroundColor: "#0969da", padding: 12, borderRadius: 8, marginBottom: 12 }}
        onPress={async () => {
          const r = await getInfo({});
          setInfo(JSON.stringify(r, null, 2));
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Load Connection Info</Text>
      </Pressable>
      {info ? <Text style={{ marginBottom: 12 }}>{info}</Text> : null}

      <Pressable
        style={{ backgroundColor: "#1a7f37", padding: 12, borderRadius: 8, marginBottom: 12 }}
        onPress={async () => {
          const r = await pair({});
          setOutput(r.message || JSON.stringify(r));
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Generate Pairing Link / QR</Text>
      </Pressable>

      <Pressable
        style={{ backgroundColor: "#24292f", padding: 12, borderRadius: 8, marginBottom: 12 }}
        onPress={async () => {
          const r = await gh({});
          setOutput(`${r.message || ""}\n\nCode: ${r.code || "see shell"}\nURL: ${r.url || "https://github.com/login/device"}`);
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Start GitHub Device Code</Text>
      </Pressable>

      <TextInput
        placeholder="API key (sk-ant-... or sk-...)"
        value={key}
        onChangeText={setKey}
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 6, marginBottom: 8 }}
      />
      <Pressable
        style={{ backgroundColor: "#8250df", padding: 12, borderRadius: 8, marginBottom: 12 }}
        onPress={async () => {
          const r = await save({ key });
          setOutput(r.message);
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Save API Key</Text>
      </Pressable>

      {output ? <Text style={{ marginTop: 8 }}>{output}</Text> : null}
    </ScrollView>
  );
}
