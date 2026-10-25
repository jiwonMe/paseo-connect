import { z } from "zod";
import { defineRpc } from "@getpaseo/plugin";

export const connectionInfo = defineRpc({
  method: "connection.info",
  input: z.object({}),
  output: z.object({
    publicDomain: z.string().nullable(),
    webUiUrl: z.string().nullable(),
    hasPassword: z.boolean(),
    relayEnabled: z.boolean(),
  }),
});

export const startPairing = defineRpc({
  method: "connection.pair",
  input: z.object({}),
  output: z.object({
    url: z.string().nullable(),
    qr: z.string().nullable(),
    error: z.string().optional(),
  }),
});

export const startGithubAuth = defineRpc({
  method: "auth.github.start",
  input: z.object({}),
  output: z.object({
    code: z.string().nullable(),
    url: z.string(),
    raw: z.string().optional(),
  }),
});

export const saveKeys = defineRpc({
  method: "auth.keys.save",
  input: z.object({
    anthropic: z.string().optional(),
    openai: z.string().optional(),
    github: z.string().optional(),
  }),
  output: z.object({
    ok: z.boolean(),
    path: z.string().optional(),
  }),
});
