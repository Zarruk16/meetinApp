import { useMemo } from "react";
import { View, ScrollView, StyleSheet, Dimensions, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Participant } from "livekit-client";
import { ParticipantTile } from "./ParticipantTile";
import { MEETING_LAYOUTS, type MeetingLayout } from "./layout";

type Props = {
  participants: Participant[];
  layout: MeetingLayout;
  isHandRaised: (id: string) => boolean;
  hostIdentity?: string;
  localIsHost?: boolean;
};

type TileCtx = Pick<Props, "isHandRaised" | "hostIdentity" | "localIsHost">;

function tileProps(ctx: TileCtx, p: Participant, large = false) {
  return {
    participant: p,
    large,
    handRaised: ctx.isHandRaised(p.identity),
    hostIdentity: ctx.hostIdentity,
    localIsHost: ctx.localIsHost,
  };
}

function pickSpeakerDominant(participants: Participant[]): Participant | null {
  const speakingRemote = participants.find((p) => p.isSpeaking && !p.isLocal);
  if (speakingRemote) return speakingRemote;
  const anySpeaking = participants.find((p) => p.isSpeaking);
  if (anySpeaking) return anySpeaking;
  const remote = participants.find((p) => !p.isLocal);
  if (remote) return remote;
  return participants[0] ?? null;
}

function GridStage(props: Props) {
  const { participants } = props;
  const count = participants.length;

  if (count === 0) {
    return (
      <View style={styles.emptyStage}>
        <LinearGradient colors={["#18181b", "#27272a"]} style={StyleSheet.absoluteFill} />
      </View>
    );
  }

  if (count === 1) {
    return (
      <View style={styles.gridSingleWrap}>
        <View style={styles.gridSingleTile}>
          <ParticipantTile {...tileProps(props, participants[0], true)} />
        </View>
      </View>
    );
  }

  if (count === 2) {
    return (
      <View style={styles.gridTwoCol}>
        {participants.map((p) => (
          <View key={p.identity} style={styles.gridTwoColItem}>
            <ParticipantTile {...tileProps(props, p)} />
          </View>
        ))}
      </View>
    );
  }

  if (count <= 4) {
    return (
      <View style={styles.grid2}>
        {participants.map((p) => (
          <View key={p.identity} style={styles.grid2Item}>
            <ParticipantTile {...tileProps(props, p)} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.gridScroll} showsVerticalScrollIndicator={false}>
      <View style={styles.grid3}>
        {participants.map((p) => (
          <View key={p.identity} style={styles.grid3Item}>
            <ParticipantTile {...tileProps(props, p)} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function SpeakerStage(props: Props) {
  const { participants } = props;
  const dominant = useMemo(() => pickSpeakerDominant(participants), [participants]);
  const thumbnails = useMemo(
    () => (dominant ? participants.filter((p) => p.identity !== dominant.identity) : []),
    [participants, dominant]
  );

  if (!dominant) {
    return (
      <View style={styles.emptyStage}>
        <LinearGradient colors={["#18181b", "#27272a"]} style={StyleSheet.absoluteFill} />
      </View>
    );
  }

  return (
    <View style={styles.speakerRoot}>
      <View style={styles.speakerMain}>
        <ParticipantTile {...tileProps(props, dominant, true)} />
      </View>
      {thumbnails.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filmstripContent}
          style={styles.filmstrip}
        >
          {thumbnails.map((p) => (
            <View key={p.identity} style={styles.filmItem}>
              <ParticipantTile {...tileProps(props, p)} />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.speakerHint}>
          <Text style={styles.speakerHintText}>Speaker view · waiting for others</Text>
        </View>
      )}
    </View>
  );
}

export function ParticipantStage(props: Props) {
  if (props.layout === MEETING_LAYOUTS.SPEAKER) {
    return <SpeakerStage {...props} />;
  }
  return <GridStage {...props} />;
}

const { width } = Dimensions.get("window");
const gap = 10;
const grid2Width = (width - 24 - gap) / 2;
const grid3Width = (width - 24 - gap * 2) / 3;

const styles = StyleSheet.create({
  emptyStage: { flex: 1, borderRadius: 22, overflow: "hidden", minHeight: 200 },
  gridSingleWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 8 },
  gridSingleTile: { width: "100%", aspectRatio: 4 / 3, maxHeight: "72%" },
  gridTwoCol: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap,
    alignContent: "center",
    justifyContent: "center",
  },
  gridTwoColItem: { width: grid2Width, aspectRatio: 3 / 4, maxHeight: "46%" },
  grid2: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap, alignContent: "center", justifyContent: "center" },
  grid2Item: { width: grid2Width, aspectRatio: 3 / 4, maxHeight: "48%" },
  gridScroll: { paddingBottom: 8, flexGrow: 1, justifyContent: "center" },
  grid3: { flexDirection: "row", flexWrap: "wrap", gap, justifyContent: "center" },
  grid3Item: { width: grid3Width, aspectRatio: 3 / 4 },
  speakerRoot: { flex: 1, gap: 8 },
  speakerMain: { flex: 1, minHeight: 220 },
  filmstrip: { maxHeight: 124 },
  filmstripContent: { gap: 10, paddingRight: 4 },
  filmItem: { width: 112, height: 112 },
  speakerHint: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  speakerHintText: { fontSize: 11, color: "#71717a", fontWeight: "500" },
});
