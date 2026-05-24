import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { ConnectionState } from "livekit-client";

export type ReconnectPhase = "idle" | "reconnecting" | "recovered" | "offline";

/**
 * Tracks network + app lifecycle for LiveKit reconnect UX.
 */
export function useMeetingReconnect(connectionState: ConnectionState) {
  const [phase, setPhase] = useState<ReconnectPhase>("idle");
  const wasConnected = useRef(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (connectionState === ConnectionState.Connected) {
      wasConnected.current = true;
      if (phase === "reconnecting" || phase === "offline") {
        setPhase("recovered");
        const t = setTimeout(() => setPhase("idle"), 2500);
        return () => clearTimeout(t);
      }
      return;
    }

    if (
      wasConnected.current &&
      (connectionState === ConnectionState.Reconnecting ||
        connectionState === ConnectionState.Disconnected)
    ) {
      setPhase("reconnecting");
    }
  }, [connectionState, phase]);

  useEffect(() => {
    const sub = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setPhase("offline");
        return;
      }
      if (wasConnected.current && connectionState !== ConnectionState.Connected) {
        setPhase("reconnecting");
      }
    });
    return () => sub();
  }, [connectionState]);

  useEffect(() => {
    const onAppState = (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;
      if (prev.match(/inactive|background/) && next === "active") {
        if (wasConnected.current && connectionState !== ConnectionState.Connected) {
          setPhase("reconnecting");
        }
      }
    };
    const sub = AppState.addEventListener("change", onAppState);
    return () => sub.remove();
  }, [connectionState]);

  return { phase, isReconnecting: phase === "reconnecting" || phase === "offline" };
}
