import { mergeStyleSets } from "@fluentui/merge-styles";
import {
  ComboBox,
  DefaultButton,
  PrimaryButton,
  Stack,
  TextField,
} from "@fluentui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { DataContext, IUseData } from "../hooks/useData";
import { MOBILE } from "../theme/constants";

const $ = mergeStyleSets({
  root: {
    height: "100%",
    width: "100%",
    paddingLeft: 5,
    paddingRight: 10,
  },
  form: {
    [MOBILE]: {
      marginTop: 0,
    },
  },
  header: {
    background: "#303030",
    height: 45,
    width: "100%",
    boxSizing: "border-box",
    paddingLeft: 5,
    paddingRight: 12,
    zIndex: 1111,
    position: "fixed",
    top: 0,
    [MOBILE]: {
      height: 80,
    },
  },
  brand: {
    fontSize: "2.3rem",
    fontWeight: "bold",
    letterSpacing: "-0.09rem",
    cursor: "pointer",
  },
  subBrand: {
    content: "/patches",
    opacity: 0.5,
  },
});

const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { tags, search, selectedTags, setSearchState } = useContext(
    DataContext
  ) as IUseData;
  const [localSearch, setSearch] = useState(search);
  const [localSelectedTags, setSelectedTags] = useState<string[]>(selectedTags);
  const h = useHistory();

  const go = useCallback(() => {
    if (localSearch.length > 0 || localSelectedTags.length > 0) {
      h.push(`/search/${localSearch}---${localSelectedTags.join("---")}`);
    } else if (window.location.pathname.startsWith("/search")) {
      h.push("/");
    }
  }, [h, localSearch, localSelectedTags]);

  useEffect(() => {
    setSearch(search);
    setSelectedTags(selectedTags);
  }, [search, selectedTags]);

  return (
    <header className={$.header}>
      <Stack
        horizontal
        wrap
        className={$.root}
        verticalAlign="center"
        horizontalAlign="space-between"
      >
        <Stack horizontal gap={16}>
          <div role="button" onClick={() => h.push("/")}>
            <h1 className={$.brand}>
              bespoke<span className={$.subBrand}>/patches</span>
            </h1>
          </div>
          <DefaultButton
            onClick={() => h.push("/upload")}
            style={{
              position: "relative",
              top: 1,
              ...(location.pathname === "/upload"
                ? { background: "white", color: "#676767" }
                : {}),
            }}
          >
            {t("Upload.button")}
          </DefaultButton>
        </Stack>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go();
          }}
          className={$.form}
        >
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <TextField
              placeholder={t("Header.search")}
              onChange={(e, v) => setSearch(v!)}
              value={localSearch}
            />
            <ComboBox
              placeholder={t("Header.tags")}
              options={Array.from(tags).map((ta) => ({ key: ta, text: ta }))}
              multiSelect
              selectedKey={localSelectedTags}
              onChange={(values, option) =>
                option &&
                setSelectedTags(
                  option.selected
                    ? [...localSelectedTags, option.key as string]
                    : localSelectedTags.filter(
                        (ta) => ta !== (option.key as string)
                      )
                )
              }
              allowFreeform={false}
            />
            <PrimaryButton type="primary" onClick={go}>
              {t("Header.go")}
            </PrimaryButton>
          </Stack>
        </form>
      </Stack>
    </header>
  );
};

export default Header;
