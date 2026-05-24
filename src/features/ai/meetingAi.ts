import { apiFetch } from "../../services/api";

export type MeetingSummary = {
  title?: string;
  summary?: string;
  keyPoints?: string[];
  actionItems?: string[];
  decisions?: string[];
  speakerHighlights?: Array<{ speaker: string; contribution: string }>;
  timestamps?: Array<{ time: string; label: string; note: string }>;
  summaryNote?: string | null;
};

export async function fetchMeetingSummary(roomId: string) {
  return apiFetch<{ summary: MeetingSummary | null }>(`/api/meetings/${roomId}/summary`);
}

export async function generateMeetingSummary(roomId: string, transcript?: string) {
  return apiFetch<{ summary: MeetingSummary }>(`/api/meetings/${roomId}/summary`, {
    method: "POST",
    body: JSON.stringify({ transcript }),
  });
}

/** Realtime transcription segment (post-meeting / streaming API). */
export async function fetchMeetingTranscript(roomId: string) {
  return apiFetch<{ transcript: string | null; segments?: Array<Record<string, unknown>> }>(
    `/api/meetings/${roomId}/transcript`
  );
}
