import type { PluginServerContext } from "@getpaseo/plugin/server";
import { getInfo, doPairing, doGitHub, saveKey } from "./server/connection";
import {
  getConnectionInfo,
  startPairing,
  startGitHubDevice,
  saveApiKey,
} from "./shared/connection";

export default function contribute(server: PluginServerContext) {
  server.handle(getConnectionInfo, getInfo);
  server.handle(startPairing, doPairing);
  server.handle(startGitHubDevice, doGitHub);
  server.handle(saveApiKey, saveKey);
  return () => {};
}
