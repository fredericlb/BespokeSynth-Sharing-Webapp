import { mergeStyleSets } from "@fluentui/merge-styles";
import React from "react";
import { useTranslation } from "react-i18next";
import SectionTitle from "./Typography";

const $ = mergeStyleSets({
  p: {
    color: "#bbbbbb",
    a: {
      color: "#bbbbbb",
    },
  },
});

const AboutContent: React.FC<{ short?: boolean }> = ({ short = false }) => {
  const { t } = useTranslation();
  return (
    <div>
      <SectionTitle>{t("About.title")}</SectionTitle>
      <p
        className={$.p}
        dangerouslySetInnerHTML={{ __html: t("About.description") }}
      />
    </div>
  );
};

export default AboutContent;
