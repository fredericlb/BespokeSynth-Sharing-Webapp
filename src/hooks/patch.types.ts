export interface PatchSummary {
  id: string;
  tags: string[];
  author: string[];
  summary: string[];
  title: string[];
  version: string[];
  publish: string;
  audio_samples: string[];
}

export interface Module {
  name: string;
  type: string;
  script?: string;
  comment?: string;
  position: [number, number];
  target?: string;
}

export interface Patch extends PatchSummary {
  html: string;
  bsk_content: {
    modules: Module[];
  };
  scripts: string[];
  bsk_path: string;
  bsk_download: string;
}
