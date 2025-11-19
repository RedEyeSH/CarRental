import React, { useEffect, useState } from "react";
import i18n from "../../i18n";

/*
  LanguageSelector
  - Standardized list of supported languages
  - Persists selection to localStorage (key: LANG_KEY)
  - Updates i18next language and document <html> lang/dir for RTL support
  - Accessible select with aria-label
*/
const LANG_KEY = "lang";
const RTL_LANGS = ["ar", "he", "fa", "ur"];

const SUPPORTED_LANGS = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語 / Japanese" },
  { code: "ru", label: "Русский / Russian" },
  { code: "ar", label: "العربية / Arabic" },
];

export default function LanguageSelector({ className }) {
  // determine initial language: localStorage -> i18n detected -> fallback to 'en'
  const getInitialLang = () =>
    localStorage.getItem(LANG_KEY) || i18n.language || "en";

  const [selectedLang, setSelectedLang] = useState(getInitialLang());

  // keep i18n and document attributes synced on mount
  useEffect(() => {
    const lang = selectedLang;
    i18n.changeLanguage(lang).catch(() => {}); // ignore change errors
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
    // persist initial value (covers first-time use)
    localStorage.setItem(LANG_KEY, lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // handler for user changes
  const handleChange = (event) => {
    const lang = event.target.value;
    setSelectedLang(lang);
    // update i18n, persist, and set html attributes
    i18n.changeLanguage(lang).catch(() => {});
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  };

  return (
    <select
      id="language-selector"
      aria-label="Select language"
      className={className}
      onChange={handleChange}
      value={selectedLang}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        margin: "16px 0 24px 0",
      }}
    >
      {SUPPORTED_LANGS.map((lng) => (
        <option key={lng.code} value={lng.code}>
          {lng.label}
        </option>
      ))}
    </select>
  );
}