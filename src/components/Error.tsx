import { mergeStyleSets } from "@fluentui/merge-styles";
import React from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const $ = mergeStyleSets({
  error: {
    background: "#aa0000",
    padding: 50,
  },
  errorFull: {
    pointerEvents: "none",
    width: "100vw",
    height: "calc(100vh - 50px)",
    marginTop: 50,
    position: "fixed",
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
});

const Error: React.FC = () => {
  const { t } = useTranslation();
  return createPortal(
    <div className={$.errorFull}>
      <div className={$.error}>
        <div className={$.title}>{t("Error.title")}</div>
        <div>{t("Error.content")}</div>
      </div>
    </div>,
    document.body
  );
};

export default Error;
