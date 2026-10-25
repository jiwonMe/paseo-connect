import type { PluginClientContext } from "@getpaseo/plugin/client";
import { ConnectScreen } from "./client/connect";

export default function contribute(client: PluginClientContext) {
  client.addScreen({
    id: "connect",
    title: "Connect",
    Component: ConnectScreen,
  });

  client.addSidebarHeaderItem({
    id: "connect",
    title: "Connect",
    Component: () => null, // sidebar row handled by host or simple label
  });

  return () => {};
}
