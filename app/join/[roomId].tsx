import { Redirect, useLocalSearchParams } from "expo-router";
import { parseMeetingIdentifier } from "../../src/lib/parseMeetingInput";

/** Deep link: /join/{roomId} — same path as the web app */
export default function JoinByRoomIdScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const parsed = parseMeetingIdentifier(String(roomId || ""));

  return <Redirect href={{ pathname: "/join", params: { roomId: parsed } }} />;
}
