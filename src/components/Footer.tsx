import { mergeStyleSets } from "@fluentui/merge-styles";
import React from "react";
import { useTranslation } from "react-i18next";

import copyleft from "../theme/copyleft.svg";

const $ = mergeStyleSets({
  root: {
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: ".8rem",
    opacity: 0.8,
    "::before": {
      content: "' '",
      background: `url(${copyleft})`,
      backgroundSize: "contain",
      width: 11,
      height: 11,
      marginRight: 4,
      position: "relative",
      top: -1,
    },
  },
});

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return <div className={$.root}>{t("Footer.text")}</div>;
};

export default Footer;
