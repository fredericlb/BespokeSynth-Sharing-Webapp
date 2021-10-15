import { DefaultButton } from "@fluentui/react";
import React, { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useHistory } from "react-router-dom";
import About from "../components/AboutContent";
import PatchList from "../components/PatchList";
import { DataContext, IUseData } from "../hooks/useData";

const Home: React.FC = () => {
  const { setSearchState, ...data } = useContext(DataContext) as IUseData;
  const { searchState } = useParams<{ searchState: string }>();
  const h = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    setSearchState(searchState);
  }, [searchState, setSearchState]);
  const noFilters = useMemo(
    () => data.search.length === 0 && data.selectedTags.length === 0,
    [data]
  );
  return (
    <div className="page-home">
      {noFilters && <About />}
      {!noFilters && (
        <DefaultButton
          style={{ marginTop: 24 }}
          onClick={() => h.push("/")}
          iconProps={{ iconName: "back" }}
        >
          {t("Patch.back")}
        </DefaultButton>
      )}
      <PatchList />
    </div>
  );
};

export default Home;
