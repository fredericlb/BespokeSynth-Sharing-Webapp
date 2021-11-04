import { mergeStyleSets } from "@fluentui/merge-styles";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import copyleft from "../theme/copyleft.svg";

const $ = mergeStyleSets({
  root: {
    height: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: ".8rem",
    opacity: 0.8,

    a: {
      color: "white",
    },

    button: {
      color: "white",
      fontSize: ".8rem",
      background: "transparent",
      padding: 0,
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  copyleft: {
    display: "inline-block",
    width: 11,
    height: 11,
    marginRight: 4,
    "::before": {
      content: "' '",
      background: `url(${copyleft})`,
      display: "block",
      backgroundSize: "contain",
      width: 11,
      height: 11,
      position: "relative",
      top: 1,
    },
  },
});

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const disabledMetrics = useMemo(
    () => localStorage.getItem("disabledMetrics") !== null,
    []
  );

  const toggle = useCallback(() => {
    if (disabledMetrics) {
      localStorage.removeItem("disabledMetrics");
    } else {
      localStorage.setItem("disabledMetrics", "true");
    }
    window.location.reload();
  }, [disabledMetrics]);

  return (
    <div className={$.root}>
      <div>
        <span className={$.copyleft} />
        {t("Footer.text")}
      </div>
      <div>
        {t("Footer.privacy1")}{" "}
        <a href="https://github.com/mikecao/umami">Umami</a>
        {t("Footer.privacy2")} (
        <button type="button" onClick={toggle}>
          {t(disabledMetrics ? "enable" : "disable")}
        </button>
        )
      </div>
    </div>
  );
};

export default Footer;
