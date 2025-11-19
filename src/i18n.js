import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ja from "./locales/ja.json";
import ru from "./locales/ru.json";
import ar from "./locales/ar.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ja: { translation: ja },
            ru: { translation: ru },
            ar: { translation: ar }
        },
        fallbackLng: "en",
        detection: {
            order: ["localStorage", "navigator", "htmlTag"],
            caches: ["localStorage"],
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
