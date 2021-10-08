import { mergeStyleSets } from "@fluentui/merge-styles";
import React, { useContext } from "react";
import { DataContext, IUseData } from "../hooks/useData";
import { MOBILE } from "../theme/constants";
import PatchItem from "./PatchItem";
import SectionTitle from "./Typography";

const $ = mergeStyleSets({
  list: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    [MOBILE]: {
      gridTemplateColumns: "1fr",
    },
  },
});

const PatchList: React.FC = () => {
  const { filteredPatchList } = useContext(DataContext) as IUseData;

  return (
    <div className="patch-list">
      <SectionTitle>Patches</SectionTitle>
      <div className={$.list}>
        {filteredPatchList.map((p) => (
          <PatchItem patch={p} key={p.id} isList />
        ))}
      </div>
    </div>
  );
};

export default PatchList;
