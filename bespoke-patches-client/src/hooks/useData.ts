import { gql, useQuery } from "@apollo/client";
import { createContext, useMemo, useState } from "react";
import { PatchSummary } from "./patch.types";

const searchGQL = gql`
  query ($search: String!, $tags: [String!]!) {
    patches(search: $search, tags: $tags) {
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
}

export const DataContext = createContext<Partial<IUseData>>({});

const useData = (): IUseData => {
  const [searchState, setSearchState] = useState<string>();

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

  const { data, loading, error } = useQuery(searchGQL, {
    variables: { search, tags: selectedTags },
  });

  const { data: resultTags } = useQuery(tagsGQL);

  const filteredPatchList = useMemo(
    () => (data?.patches ? (data.patches as PatchSummary[]) : []),
    [data]
  );

  const tags = useMemo(() => {
    if (resultTags && resultTags.tags) {
      return new Set<string>(resultTags.tags);
    }
    return new Set<string>();
  }, [resultTags]);

  return {
    isLoaded: !loading,
    isError: !!error,
    filteredPatchList,
    tags,
    search,
    selectedTags,
    setSearchState,
  };
};

export default useData;
