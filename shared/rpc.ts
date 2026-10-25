import { z } from "zod";
import { defineRpc } from "@getpaseo/plugin/shared";

export const getConnectionInfo = defineRpc({
  name: "connect.getInfo",
  input: z.object({}).strict(),
  output: z.object({
    webUrl: z.string().optional(),
    hasPassword: z.boolean(),
    relayEnabled: z.boolean(),
  }),
});

export const generatePairing = defineRpc({
  name: "connect.pairing",
  input: z.object({}).strict(),
  output: z.object({
    link: z.string().optional(),
    error: z.string().optional(),
  }),
});

export const startGhDevice = defineRpc({
  name: "connect.ghDevice",
  input: z.object({}).strict(),
  output: z.object({
    output: z.string(),
  }),
});

export const saveApiKeys = defineRpc({
  name: "connect.saveKeys",
  input: z.object({
    anthropic: z.string().optional(),
    openai: z.string().optional(),
    github: z.string().optional(),
  }).strict(),
  output: z.object({
    ok: z.boolean(),
    message: z.string(),
  }),
});
