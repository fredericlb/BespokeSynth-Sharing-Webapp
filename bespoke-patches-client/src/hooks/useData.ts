import { gql, useLazyQuery, useQuery } from "@apollo/client";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PatchSummary } from "./patch.types";

const searchGQL = gql`
  query ($search: String!, $tags: [String!]!, $offset: Int, $limit: Int) {
    patches(search: $search, tags: $tags, offset: $offset, limit: $limit) {
      uuid
      tags
      author
      summary
      title
      publicationDate
      coverImage
      revision
    }
  }
`;

const tagsGQL = gql`
  query {
    tags
  }
`;

export interface IUseData {
  isLoaded: boolean;
  isError: boolean;
  filteredPatchList: PatchSummary[];
  tags: Set<string>;
  setSearchState: (s: string | undefined) => void;
  search: string;
  selectedTags: string[];
  loadMore: () => boolean;
  mightHaveMore: boolean;
}

export const DataContext = createContext<Partial<IUseData>>({});
const LIMIT = 50;

const useData = (): IUseData => {
  const [searchState, setSearchState] = useState<string>();
  const [alreadyLoaded, setAlreadyLoaded] = useState<PatchSummary[]>([]);
  const [lastPage, setLastPage] = useState(0);

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

  const [list, { data, loading, error }] = useLazyQuery(searchGQL);

  const { data: resultTags } = useQuery(tagsGQL);

  const filteredPatchList = useMemo(
    () => [
      ...alreadyLoaded,
      ...(data?.patches ? (data.patches as PatchSummary[]) : []),
    ],
    [alreadyLoaded, data]
  );

  const tags = useMemo(() => {
    if (resultTags && resultTags.tags) {
      return new Set<string>(resultTags.tags);
    }
    return new Set<string>();
  }, [resultTags]);

  const mightHaveMore = useMemo(() => data?.patches.length === LIMIT, [data]);

  const loadMore = useCallback(() => {
    const page = lastPage + 1;
    setLastPage(page);
    setAlreadyLoaded(filteredPatchList);
    if (data?.patches.length < LIMIT) {
      return false;
    }
    list({
      variables: {
        search,
        tags: selectedTags,
        offset: page * LIMIT,
        limit: LIMIT,
      },
    });
    return true;
  }, [data, filteredPatchList, lastPage, list, search, selectedTags]);

  useEffect(() => {
    setAlreadyLoaded([]);
    setLastPage(0);
    list({
      variables: { search, tags: selectedTags, offset: 0, limit: LIMIT },
    });
  }, [list, search, selectedTags]);

  return {
    isLoaded: !loading,
    isError: !!error,
    filteredPatchList,
    loadMore,
    tags,
    search,
    selectedTags,
    setSearchState,
    mightHaveMore,
  };
};

export default useData;
