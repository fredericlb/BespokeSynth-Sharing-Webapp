import { makeStyles, PrimaryButton, Stack } from "@fluentui/react";
import React, { CSSProperties, useContext } from "react";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { useHistory, Link, useLocation } from "react-router-dom";
import { PatchSummary } from "../hooks/patch.types";
import { DataContext, IUseData } from "../hooks/useData";
import { MOBILE } from "../theme/constants";

const useStyle = makeStyles(() => ({
  root: {
    background: "#343434",
    position: "relative",
  },
  title: {
    background: "#EFEFEF",
    width: "100%",
    fontWeight: "bold",
    fontSize: "1.3rem",
    cursor: "pointer",
    color: "#343434",
    height: 30,
    display: "flex",
    alignItems: "center",
    paddingLeft: 8,
    boxSizing: "border-box",
    borderBottom: "3px solid #676767",
    justifyContent: "space-between",
    paddingRight: 8,
    textDecoration: "none",
  },
  content: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    [MOBILE]: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
      flexDirection: "column",
    },
  },
  titleInList: {
    selectors: {
      "&:after": {
        content: "'→'",
      },
    },
  },
  subpatch: {
    display: "flex",
    opacity: 0.7,
    [MOBILE]: {
      flexDirection: "column",
    },
  },
  subpatchTitle: {
    fontWeight: "bold",
  },
  separator: {
    "&:before": {
      content: "'//'",
      display: "inline-block",
      marginLeft: 8,
      marginRight: 8,
      marginBottom: 2,
      fontSize: "1rem",
      [MOBILE]: {
        display: "none",
      },
    },
  },
  tags: {
    marginTop: 4,
  },
  tag: {
    background: "#676767",
    display: "inline-block",
    padding: "2px 5px",
    marginRight: 8,
  },
  download: {
    marginRight: 16,
    [MOBILE]: {
      paddingTop: 16,
      marginRight: 0,
      display: "flex",
      justifyContent: "center",
    },
  },
  description: {
    marginTop: 12,
  },
}));

const PatchItem: React.FC<{
  patch: PatchSummary;
  onDownload?: () => void;
  isList: boolean;
}> = ({ patch, onDownload, isList }) => {
  const $ = useStyle();
  const { search, selectedTags } = useContext(DataContext) as IUseData;
  const h = useHistory();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const getTagStyle = (tag: string): CSSProperties => {
    if (tag === "patch") {
      return { backgroundColor: "#ff7750", color: "black" };
    }
    if (tag === "prefab") {
      return { backgroundColor: "#bc42f5", color: "black" };
    }
    if (selectedTags.includes(tag)) {
      return { background: "yellow", color: "black" };
    }

    return {};
  };
  const $title = (
    <Highlighter
      highlightClassName="highlight"
      searchWords={[search]}
      autoEscape
      textToHighlight={patch.title}
    />
  );
  return (
    <div className={$.root}>
      {isList ? (
        <Link
          to={{ pathname: `/patch/${patch.uuid}`, state: { search: pathname } }}
          className={`${$.title} ${isList && $.titleInList}`}
        >
          {$title}
        </Link>
      ) : (
        <div className={`${$.title} ${isList && $.titleInList}`}>{$title}</div>
      )}
      <Stack
        className={$.content}
        verticalAlign="center"
        horizontalAlign="space-between"
      >
        <div>
          <div className={$.subpatch}>
            <div>
              <span className={$.subpatchTitle}>{t("PatchItem.author")}:</span>{" "}
              {patch.author}{" "}
            </div>
            <div className={$.separator}>
              <span className={$.subpatchTitle}>{t("PatchItem.date")}: </span>{" "}
              {new Date(patch.publicationDate).toLocaleString("en-US")}
            </div>
            <div className={$.separator}>
              <span className={$.subpatchTitle}>
                {t("PatchItem.appVersion")}:{" "}
              </span>{" "}
              {patch.appVersion}
            </div>
          </div>
          <div className={$.tags}>
            {patch.tags.map((tag) => (
              <div className={$.tag} key={tag} style={getTagStyle(tag)}>
                {tag}
              </div>
            ))}
          </div>
          <p className={$.description}>
            <Highlighter
              searchWords={[search]}
              autoEscape
              textToHighlight={patch.summary}
            />
          </p>
        </div>
        {onDownload && (
          <div className={$.download}>
            <PrimaryButton
              iconProps={{ iconName: "download" }}
              onClick={onDownload}
            >
              {t("PatchItem.download")}
            </PrimaryButton>
          </div>
        )}
      </Stack>
    </div>
  );
};

export default PatchItem;
