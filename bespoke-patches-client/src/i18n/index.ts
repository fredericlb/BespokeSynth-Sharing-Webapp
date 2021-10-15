import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en";

const initLocales: () => void = () => {
  i18next.use(initReactI18next).init({
    resources: {
      en: { translation: en },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

export default initLocales;
