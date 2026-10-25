import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import type { RpcInput } from "@getpaseo/plugin";
import {
  getConnectionInfo,
  startPairing,
  startGitHubDevice,
  saveApiKey,
} from "../shared/connection";

const execAsync = promisify(exec);

export async function getInfo(): Promise<RpcInput<typeof getConnectionInfo> extends never ? any : any> {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  return {
    webUi: domain ? `https://${domain}` : undefined,
    passwordSet: !!process.env.PASEO_PASSWORD,
    relayEnabled: process.env.PASEO_RELAY_ENABLED === "true",
  };
}

export async function doPairing() {
  try {
    const { stdout } = await execAsync("paseo daemon pair --relay 2>&1 || true");
    return { message: stdout.slice(0, 500), url: undefined, code: undefined };
  } catch (e: any) {
    return { message: String(e.message || e) };
  }
}

export async function doGitHub() {
  try {
    const { stdout } = await execAsync("gh auth login --web --hostname github.com 2>&1 || true", {
      timeout: 8000,
    });
    const codeMatch = stdout.match(/code:\s*([A-Z0-9-]+)/i) || stdout.match(/([A-Z0-9]{4}-[A-Z0-9]{4})/);
    return {
      message: stdout.slice(0, 400),
      code: codeMatch?.[1],
      url: "https://github.com/login/device",
    };
  } catch (e: any) {
    return { message: "Run in shell: gh auth login --web", url: "https://github.com/login/device" };
  }
}

export async function saveKey({ key, provider }: { key: string; provider?: string }) {
  const envPath = path.join(process.env.HOME || "/home/paseo", ".paseo", ".env.auth");
  const line = provider === "openai"
    ? `OPENAI_API_KEY=${key}`
    : provider === "github"
    ? `GH_TOKEN=${key}`
    : `ANTHROPIC_API_KEY=${key}`;
  await fs.appendFile(envPath, line + "\n", "utf8").catch(() => {});
  return { ok: true, message: "Saved to .env.auth (restart daemon to load)" };
}
