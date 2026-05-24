export const MEETING_LAYOUTS = {
  GRID: "grid",
  SPEAKER: "speaker",
} as const;

export type MeetingLayout = (typeof MEETING_LAYOUTS)[keyof typeof MEETING_LAYOUTS];

export const LAYOUT_OPTIONS: {
  id: MeetingLayout;
  label: string;
  description: string;
  icon: "grid-outline" | "person-outline";
}[] = [
  {
    id: MEETING_LAYOUTS.GRID,
    label: "Grid",
    description: "Equal tiles for everyone",
    icon: "grid-outline",
  },
  {
    id: MEETING_LAYOUTS.SPEAKER,
    label: "Speaker",
    description: "Large active speaker + strip",
    icon: "person-outline",
  },
];
