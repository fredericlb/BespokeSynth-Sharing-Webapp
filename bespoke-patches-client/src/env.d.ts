interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_UMAMI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
