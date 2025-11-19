import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import i18n from "../../i18n.js";

/**
 * Language persistence key and RTL language set.
 */
const LANG_KEY = "lang";
const RTL_LANGS = new Set(["ar", "he", "fa", "ur"]);

/**
 * Supported languages list (code, label).
 */
const SUPPORTED_LANGS = [
    { code: "en", label: "English" },
    { code: "ja", label: "日本語 / Japanese" },
    { code: "ru", label: "Русский / Russian" },
    { code: "ar", label: "العربية / Arabic" },
];

/**
 * Safely read from localStorage (defensive for SSR and strict environments).
 * @param {string} key
 * @returns {string|null}
 */
function safeGetStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

/**
 * Safely write to localStorage.
 * @param {string} key
 * @param {string} value
 */
function safeSetStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // ignore storage errors (e.g. private mode)
    }
}

/**
 * Returns true when the language should be right-to-left.
 * @param {string} code
 * @returns {boolean}
 */
function isRtl(code) {
    return RTL_LANGS.has(code);
}

/**
 * Apply language across i18n and document attributes and persist selection.
 * @param {string} code
 */
async function applyLanguage(code) {
    try {
        await i18n.changeLanguage(code);
    } catch {
        // ignore i18n errors
    }
    document.documentElement.lang = code;
    document.documentElement.dir = isRtl(code) ? "rtl" : "ltr";
    safeSetStorage(LANG_KEY, code);
}

/**
 * Determine initial language: localStorage -> i18n detected -> fallback 'en'.
 * @returns {string}
 */
function getInitialLang() {
    return safeGetStorage(LANG_KEY) || i18n.language || "en";
}

/**
 * LanguageSelector component
 * - Controlled <select> that persists language and updates i18n + <html> attrs.
 */
export default function LanguageSelector({ className }) {
    const [selectedLang, setSelectedLang] = useState(getInitialLang());

    // Centralize side-effects: whenever selectedLang changes, apply across app.
    useEffect(() => {
        applyLanguage(selectedLang);
    }, [selectedLang]);

    // Only updates the state; side-effects are handled by the effect above.
    const handleChange = useCallback((event) => {
        setSelectedLang(event.target.value);
    }, []);

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

LanguageSelector.propTypes = {
    className: PropTypes.string,
};

LanguageSelector.defaultProps = {
    className: undefined,
};