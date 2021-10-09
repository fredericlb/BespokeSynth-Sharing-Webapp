import { mergeStyleSets } from "@fluentui/merge-styles";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  return (
    <div className="patch-list">
      <SectionTitle>Patches</SectionTitle>
      {filteredPatchList.length === 0 && <div>{t("PatchList.no_patches")}</div>}
      <div className={$.list}>
        {filteredPatchList.map((p) => (
          <PatchItem patch={p} key={p.id} isList />
        ))}
      </div>
    </div>
  );
};

export default PatchList;
