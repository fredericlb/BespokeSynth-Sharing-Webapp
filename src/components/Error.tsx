import { mergeStyleSets } from "@fluentui/merge-styles";
import React from "react";
import { useTranslation } from "react-i18next";

const $ = mergeStyleSets({
  error: {
    background: "red",
    padding: 50,
  },
  errorFull: {
    width: "100vw",
    height: "100vh",
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
  return (
    <div className={$.errorFull}>
      <div className={$.error}>
        <div className={$.title}>{t("Error.title")}</div>
        <div>{t("Error.content")}</div>
      </div>
    </div>
  );
};

export default Error;
