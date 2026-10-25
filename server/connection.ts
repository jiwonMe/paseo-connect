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
    const { stdout } = await execAsync("paseo daemon pair --relay 2>&1 || true", { timeout: 20000 });
    return { message: stdout.slice(0, 800), url: undefined, code: undefined };
  } catch (e: any) {
    return { message: String(e.stdout || e.message || e) };
  }
}

export async function doGitHub() {
  try {
    // Use --web which prints the code and URL
    const { stdout, stderr } = await execAsync(
      "gh auth login --web --hostname github.com 2>&1 || true",
      { timeout: 12000 }
    );
    const out = (stdout || "") + (stderr || "");

    // Match common formats: XXXX-XXXX or code: XXXX-XXXX
    const codeMatch =
      out.match(/code:\s*([A-Z0-9-]{4,})/i) ||
      out.match(/([A-Z0-9]{4}-[A-Z0-9]{4})/) ||
      out.match(/one-time code[:\s]+([A-Z0-9-]+)/i);

    const urlMatch = out.match(/(https:\/\/github\.com\/login\/device[^\s]*)/i);

    return {
      message: out.slice(0, 600) || "Started device login",
      code: codeMatch?.[1] || "see output above",
      url: urlMatch?.[1] || "https://github.com/login/device",
    };
  } catch (e: any) {
    const out = String(e.stdout || e.stderr || e.message || e);
    return {
      message: out.slice(0, 400) || "Failed to start. Run manually: gh auth login --web",
      url: "https://github.com/login/device",
    };
  }
}

export async function saveKey({ key, provider }: { key: string; provider?: string }) {
  const envPath = path.join(process.env.HOME || "/home/paseo", ".paseo", ".env.auth");
  await fs.mkdir(path.dirname(envPath), { recursive: true }).catch(() => {});
  const line =
    provider === "openai"
      ? `OPENAI_API_KEY=${key}`
      : provider === "github"
      ? `GH_TOKEN=${key}`
      : `ANTHROPIC_API_KEY=${key}`;
  await fs.appendFile(envPath, line + "\n", "utf8").catch(() => {});
  return { ok: true, message: "Saved to .env.auth (restart daemon to load)" };
}
