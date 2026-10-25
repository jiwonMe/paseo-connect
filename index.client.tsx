import type { PluginClientContext, PluginSidebarItemProps } from "@getpaseo/plugin/client";
import { SidebarRow } from "@getpaseo/plugin/client/ui";
import { ConnectScreen } from "./client/connect";

function ConnectItem({ currentScreen, openScreen }: PluginSidebarItemProps) {
  return (
    <SidebarRow
      icon="Link"
      title="Connect"
      active={currentScreen?.screenId === "connect"}
      onPress={() => openScreen({ screenId: "connect" })}
    />
  );
}

export default function contribute(client: PluginClientContext) {
  client.addScreen({
    id: "connect",
    title: "Connect",
    Component: ConnectScreen,
  });

  client.addSidebarHeaderItem({
    id: "connect",
    title: "Connect",
    Component: ConnectItem,
  });

  return () => {};
}
