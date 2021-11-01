export interface PatchSummary {
  uuid: string;
  tags: string[];
  author: string;
  summary: string;
  title: string;
  publicationDate: string;
  coverImage?: string;
  revision: number;
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
  bskFile: string;
  audioSamples: string[];
  modules: Module[];
  description?: string;
}
