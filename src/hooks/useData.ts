import { createContext, useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { Patch, PatchSummary } from "./patch.types";

type PatchesDict = Record<string, PatchSummary>;

export interface IUseData {
  isLoaded: boolean;
  isError: boolean;
  load: () => void;
  filteredPatchList: PatchSummary[];
  tags: Set<string>;
  setSearchState: (s: string | undefined) => void;
  search: string;
  selectedTags: string[];
  patches: PatchesDict;
  getPatchInfo: (patchId: string) => Promise<Patch | null>;
}

const REPO =
  process.env.REPO ||
  "https://fredericlb.github.io/BespokeSynth-Community-Sharing-Repo/";

export const DataContext = createContext<Partial<IUseData>>({});

const useData = (): IUseData => {
  const [patches, setPatches] = useState<PatchesDict>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchState, setSearchState] = useState<string>();
  const h = useHistory();

  const load = useCallback(() => {
    const f = async () => {
      try {
        const resp = await fetch(`${REPO}manifest.json`);
        const ps = await resp.json();
        setPatches(ps);
        setIsError(false);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoaded(true);
      }
    };
    f();
  }, []);

  const { search, selectedTags } = useMemo(() => {
    let se = "";
    let seTags: string[] = [];

    if (searchState && searchState.includes("---")) {
      const [s, ...t] = searchState.split("---");
      if (s !== se) {
        se = s;
      }
      if (t.length !== 1 || t[0].length > 0) {
        seTags = t;
      }
    }

    return { search: se, selectedTags: seTags };
  }, [searchState]);

  const filteredPatchList = useMemo(
    () =>
      Object.values(patches)
        .filter(
          (patch) =>
            selectedTags.length === 0 ||
            selectedTags.every((tag) => patch.tags.includes(tag))
        )
        .filter(
          (patch) =>
            search.length === 0 ||
            (patch.title[0] + patch.summary[0])
              .toLowerCase()
              .includes(search.toLowerCase())
        ),
    [patches, selectedTags, search]
  );

  const tags = useMemo(
    () =>
      Object.values(patches).reduce((set, patch) => {
        patch.tags.forEach((tag) => set.add(tag));
        return set;
      }, new Set<string>()),
    [patches]
  );

  const getPatchInfo = useCallback(async (patchId: string) => {
    const projectFolder = `${REPO}${patchId}/`;
    try {
      const data = (await (
        await fetch(`${projectFolder}manifest.json`)
      ).json()) as Patch;
      const scripts = data.bsk_content.modules
        .filter(({ script }) => script != null)
        .map(({ script }) => script);
      return {
        ...data,
        audio_samples: (data.audio_samples || []).map(
          (as) => `${projectFolder}${as}`
        ),
        bsk_download: `${projectFolder}${data.bsk_path}`,
        scripts,
      } as Patch;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  return {
    isLoaded,
    isError,
    load,
    filteredPatchList,
    tags,
    search,
    selectedTags,
    patches,
    getPatchInfo,
    setSearchState,
  };
};

export default useData;
