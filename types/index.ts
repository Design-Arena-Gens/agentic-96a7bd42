export type GenerationPhase =
  | "topic"
  | "script"
  | "storyboard"
  | "assets"
  | "voice"
  | "video"
  | "upload";

export type GenerationLog = {
  id: string;
  createdAt: string;
  topic: string;
  status: "success" | "failed";
  summary?: string;
  youtubeUrl?: string;
  error?: string;
};

export type VideoPipelineResult = {
  topic: string;
  script: string;
  summary: string;
  youtubeUrl?: string;
  assetDir: string;
};

export type PromptOverrides = {
  promptOverride?: string;
};
