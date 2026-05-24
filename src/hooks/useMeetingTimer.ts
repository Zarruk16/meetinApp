import { useEffect, useState } from "react";

export function useMeetingTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  return { seconds, formatted };
}
