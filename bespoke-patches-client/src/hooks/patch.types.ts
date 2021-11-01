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

export enum PatchStatus {
  WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL",
  APPROVED = "APPROVED",
}
export interface Patch extends PatchSummary {
  bskFile: string;
  audioSamples: string[];
  content: {
    modules: Module[];
  };
  description?: string;
  status: PatchStatus;
}
