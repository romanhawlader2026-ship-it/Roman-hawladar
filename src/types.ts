export enum LayerType {
  VIDEO = "video",
  AUDIO = "audio",
  TEXT = "text",
  STICKER = "sticker",
  OVERLAY = "overlay"
}

export interface MediaClip {
  id: string;
  name: string;
  duration: number; // in seconds
  url: string; // fallback source or sample stream
  thumbnail: string; // sample visual image
  width?: number;
  height?: number;
  type: "video" | "audio" | "image";
}

export interface TimelineClip {
  id: string;
  mediaId: string;
  name: string;
  type: LayerType;
  startTime: number; // timeline starting offset in seconds
  duration: number; // dynamic clip duration on timeline in seconds
  volume?: number; // 0 to 100 for audio/video clips
  color?: string; // visual color index on timeline
  effects?: string[]; // applied effects like vhs, motion blur
  transition?: string; // transition effect at the end of clip
  textProps?: {
    text: string;
    style: "bengali" | "neon" | "gradient" | "classic" | "shadow";
    fontSize: number;
    color: string;
    background?: string;
  };
  stickerProps?: {
    stickerId: string;
    emoji: string;
    animation: "pulse" | "spin" | "bounce" | "slide";
  };
}

export interface SmartSubtitle {
  id: string;
  start: number;
  end: number;
  text: string;
}

export interface EditProject {
  id: string;
  name: string;
  updatedAt: string;
  aspectRatio: "16:9" | "9:16" | "1:1" | "2.39:1";
  duration: number; // total duration
  clips: TimelineClip[];
}
