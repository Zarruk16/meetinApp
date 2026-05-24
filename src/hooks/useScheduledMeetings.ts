import { useCallback, useState } from "react";
import {
  cacheHostKey,
  getScheduledMeetings,
  type ScheduledMeeting,
} from "../services/meetings";

export function useScheduledMeetings(hostUserId?: string, hostName?: string) {
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!hostUserId && !hostName) {
      setMeetings([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const list = await getScheduledMeetings(hostUserId || "", hostName || "");
      await Promise.all(
        list.map((m) => (m.hostKey ? cacheHostKey(m.roomId, m.hostKey) : Promise.resolve()))
      );
      setMeetings(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load scheduled meetings");
      setMeetings([]);
    } finally {
      setLoading(false);
    }
  }, [hostUserId, hostName]);

  return { meetings, loading, error, load };
}
