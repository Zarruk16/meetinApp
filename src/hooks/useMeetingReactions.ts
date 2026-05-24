import { useCallback, useEffect, useRef, useState } from "react";
import { RoomEvent } from "livekit-client";
import { useRoomContext } from "@livekit/react-native";

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "👏", "🔥", "🎉"];

export function useMeetingReactions() {
  const room = useRoomContext();
  const [bubbles, setBubbles] = useState<{ id: string; emoji: string }[]>([]);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addBubble = useCallback((emoji: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setBubbles((prev) => [...prev, { id, emoji }]);
    const t = setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 1800);
    timeouts.current.push(t);
  }, []);

  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!room) return;
    const onData = (payload: Uint8Array) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        if (data?.type === "reaction" && data.emoji) addBubble(data.emoji);
      } catch {
        // ignore
      }
    };
    room.on(RoomEvent.DataReceived, onData);
    return () => {
      room.off(RoomEvent.DataReceived, onData);
    };
  }, [room, addBubble]);

  const sendReaction = useCallback(
    async (emoji: string) => {
      if (!room?.localParticipant) return;
      addBubble(emoji);
      await room.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify({ type: "reaction", emoji })),
        { reliable: true }
      );
    },
    [room, addBubble]
  );

  return { bubbles, sendReaction };
}
