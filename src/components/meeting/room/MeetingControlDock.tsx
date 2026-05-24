import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ControlButton } from "./ControlButton";
import { ReactionsTray, DockBackdrop } from "./ReactionsTray";
import { ExpandableControlsPanel, type AdvancedControl } from "./ExpandableControlsPanel";

export type MeetingDockProps = {
  micOn: boolean;
  camOn: boolean;
  reactionsOpen: boolean;
  moreOpen: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onToggleReactions: () => void;
  onToggleMore: () => void;
  onLeave: () => void;
  reactions: string[];
  onReaction: (emoji: string) => void;
  advancedControls: AdvancedControl[];
};

export function MeetingControlDock({
  micOn,
  camOn,
  reactionsOpen,
  moreOpen,
  onToggleMic,
  onToggleCam,
  onToggleReactions,
  onToggleMore,
  onLeave,
  reactions,
  onReaction,
  advancedControls,
}: MeetingDockProps) {
  const insets = useSafeAreaInsets();
  const overlayOpen = reactionsOpen || moreOpen;

  const closePanels = useCallback(() => {
    if (reactionsOpen) onToggleReactions();
    if (moreOpen) onToggleMore();
  }, [reactionsOpen, moreOpen, onToggleReactions, onToggleMore]);

  return (
    <>
      <DockBackdrop visible={overlayOpen} onPress={closePanels} />

      <ReactionsTray
        visible={reactionsOpen}
        reactions={reactions}
        onReaction={onReaction}
        onClose={onToggleReactions}
      />

      <ExpandableControlsPanel visible={moreOpen} controls={advancedControls} onClose={onToggleMore} />

      <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <LinearGradient
          colors={["rgba(9,9,11,0.88)", "rgba(24,24,27,0.94)"]}
          style={styles.dock}
        >
          <View style={styles.row}>
            <ControlButton
              icon={micOn ? "mic" : "mic-off"}
              label={micOn ? "Mic" : "Muted"}
              active={micOn}
              onPress={onToggleMic}
            />
            <ControlButton
              icon={camOn ? "videocam" : "videocam-off"}
              label={camOn ? "Camera" : "Off"}
              active={camOn}
              onPress={onToggleCam}
            />
            <ControlButton
              icon="happy-outline"
              label="React"
              highlight={reactionsOpen}
              onPress={onToggleReactions}
            />
            <ControlButton
              icon={moreOpen ? "chevron-down" : "grid-outline"}
              label="More"
              highlight={moreOpen}
              onPress={onToggleMore}
            />
            <ControlButton icon="call" label="Leave" danger onPress={onLeave} />
          </View>
        </LinearGradient>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, bottom: 0, zIndex: 30 },
  dock: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
