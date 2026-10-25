import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";

export const getConnectionInfo = defineRpc({
  name: "connect.getInfo",
  input: z.object({}),
  output: z.object({
    webUi: z.string().optional(),
    passwordSet: z.boolean(),
    relayEnabled: z.boolean().optional(),
  }),
});

export const startPairing = defineRpc({
  name: "connect.startPairing",
  input: z.object({}),
  output: z.object({
    url: z.string().optional(),
    code: z.string().optional(),
    message: z.string(),
  }),
});

export const startGitHubDevice = defineRpc({
  name: "connect.startGitHub",
  input: z.object({}),
  output: z.object({
    code: z.string().optional(),
    url: z.string().optional(),
    message: z.string(),
  }),
});

export const saveApiKey = defineRpc({
  name: "connect.saveKey",
  input: z.object({
    key: z.string(),
    provider: z.enum(["anthropic", "openai", "github"]).optional(),
  }),
  output: z.object({
    ok: z.boolean(),
    message: z.string(),
  }),
});
