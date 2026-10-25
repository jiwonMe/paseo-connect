import { defineRpc } from "@getpaseo/plugin";
import { z } from "zod";

export const getConnectionInfo = defineRpc({
  name: "connect.get-info",
  input: z.object({}),
  output: z.object({
    webUi: z.string().optional(),
    passwordSet: z.boolean(),
    relayEnabled: z.boolean().optional(),
  }),
});

export const startPairing = defineRpc({
  name: "connect.start-pairing",
  input: z.object({}),
  output: z.object({
    url: z.string().optional(),
    code: z.string().optional(),
    message: z.string(),
  }),
});

export const startGitHubDevice = defineRpc({
  name: "connect.start-github",
  input: z.object({}),
  output: z.object({
    code: z.string().optional(),
    url: z.string().optional(),
    message: z.string(),
  }),
});

export const saveApiKey = defineRpc({
  name: "connect.save-key",
  input: z.object({
    key: z.string(),
    provider: z.enum(["anthropic", "openai", "github"]).optional(),
  }),
  output: z.object({
    ok: z.boolean(),
    message: z.string(),
  }),
});
