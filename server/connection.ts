import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const execAsync = promisify(exec);

export async function getInfo() {
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN;
  return {
    webUi: domain ? `https://${domain}` : undefined,
    passwordSet: !!process.env.PASEO_PASSWORD,
    relayEnabled: process.env.PASEO_RELAY_ENABLED === "true",
  };
}

export async function doPairing() {
  try {
    const { stdout } = await execAsync("paseo daemon pair --relay 2>&1 || true", { timeout: 10000 });
    return { message: stdout.slice(0, 800), url: undefined, code: undefined };
  } catch (e: any) {
    return { message: String(e.message || e) };
  }
}

export async function doGitHub() {
  try {
    // Run with a short timeout and capture whatever comes out
    const { stdout, stderr } = await execAsync(
      "timeout 6 gh auth login --web --hostname github.com 2>&1 || true",
      { timeout: 8000 }
    );
    const combined = (stdout + "\n" + stderr);
    const codeMatch =
      combined.match(/one-time code:\s*([A-Z0-9-]+)/i) ||
      combined.match(/code:\s*([A-Z0-9]{4}-[A-Z0-9]{4})/i) ||
      combined.match(/([A-Z0-9]{4}-[A-Z0-9]{4})/);

    if (codeMatch) {
      return {
        message: "Device code ready. Open the URL and enter the code.",
        code: codeMatch[1],
        url: "https://github.com/login/device",
      };
    }

    return {
      message:
        "Could not auto-capture code (gh is interactive).\n\n" +
        "1. Open Railway Shell\n" +
        "2. Run: gh auth login --web\n" +
        "3. Copy the one-time code shown\n" +
        "4. Open https://github.com/login/device and paste it",
      code: undefined,
      url: "https://github.com/login/device",
    };
  } catch (e: any) {
    return {
      message: "Open Railway Shell and run:\n  gh auth login --web\n\nThen visit https://github.com/login/device",
      url: "https://github.com/login/device",
    };
  }
}

export async function saveKey({ key, provider }: { key: string; provider?: string }) {
  const envPath = path.join(process.env.HOME || "/home/paseo", ".paseo", ".env.auth");
  const line =
    provider === "openai"
      ? `OPENAI_API_KEY=${key}`
      : provider === "github"
      ? `GH_TOKEN=${key}`
      : `ANTHROPIC_API_KEY=${key}`;
  await fs.appendFile(envPath, line + "\n", "utf8").catch(() => {});
  return { ok: true, message: "Saved to .env.auth (restart the service to load)" };
}
