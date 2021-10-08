import React from "react";
import { useTranslation } from "react-i18next";
import SectionTitle from "./Typography";

const AboutContent: React.FC<{ short?: boolean }> = ({ short = false }) => {
  const { t } = useTranslation();
  return (
    <div>
      <SectionTitle>{t("About.title")}</SectionTitle>
      <p>{t("About.description")}</p>
    </div>
  );
};

export default AboutContent;
