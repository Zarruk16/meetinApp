import { DefaultReconnectPolicy, type RoomOptions } from "livekit-client";

/** Production LiveKit room options for mobile — adaptive quality + reconnect. */
export const MOBILE_LIVEKIT_ROOM_OPTIONS: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
  disconnectOnPageLeave: false,
  reconnectPolicy: new DefaultReconnectPolicy(),
};
