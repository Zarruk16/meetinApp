import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { ConnectionState } from "livekit-client";

export type ReconnectPhase = "idle" | "reconnecting" | "recovered" | "offline";

const RECONNECT_UI_DELAY_MS = 2000;

/**
 * Tracks network + LiveKit state for reconnect UX (debounced to avoid emulator flapping).
 */
export function useMeetingReconnect(connectionState: ConnectionState) {
  const [phase, setPhase] = useState<ReconnectPhase>("idle");
  const wasConnected = useRef(false);
  const appState = useRef(AppState.currentState);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPending = () => {
    if (pendingTimer.current) {
      clearTimeout(pendingTimer.current);
      pendingTimer.current = null;
    }
  };

  const scheduleReconnectUi = () => {
    clearPending();
    pendingTimer.current = setTimeout(() => {
      setPhase((current) => (current === "offline" ? "offline" : "reconnecting"));
    }, RECONNECT_UI_DELAY_MS);
  };

  useEffect(() => {
    if (connectionState === ConnectionState.Connected) {
      wasConnected.current = true;
      clearPending();
      setPhase((current) => {
        if (current === "reconnecting" || current === "offline") {
          return "recovered";
        }
        return "idle";
      });
      return;
    }

    if (
      wasConnected.current &&
      (connectionState === ConnectionState.Reconnecting ||
        connectionState === ConnectionState.Disconnected)
    ) {
      scheduleReconnectUi();
    }

    return clearPending;
  }, [connectionState]);

  useEffect(() => {
    if (connectionState === ConnectionState.Connected) return;
    const sub = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        clearPending();
        setPhase("offline");
        return;
      }
      if (wasConnected.current && connectionState !== ConnectionState.Connected) {
        scheduleReconnectUi();
      }
    });
    return () => {
      sub();
      clearPending();
    };
  }, [connectionState]);

  useEffect(() => {
    const onAppState = (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;
      if (
        prev.match(/inactive|background/) &&
        next === "active" &&
        wasConnected.current &&
        connectionState !== ConnectionState.Connected
      ) {
        scheduleReconnectUi();
      }
    };
    const sub = AppState.addEventListener("change", onAppState);
    return () => sub.remove();
  }, [connectionState]);

  useEffect(() => {
    if (phase !== "recovered") return;
    const t = setTimeout(() => setPhase("idle"), 2500);
    return () => clearTimeout(t);
  }, [phase]);

  const isReconnecting =
    connectionState !== ConnectionState.Connected &&
    (phase === "reconnecting" || phase === "offline");

  return { phase: isReconnecting ? phase : connectionState === ConnectionState.Connected ? "idle" : phase, isReconnecting };
};
