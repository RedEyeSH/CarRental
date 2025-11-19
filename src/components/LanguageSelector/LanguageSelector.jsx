import React from "react";
import i18n from "../../i18n";

export default function LanguageSelector({ className }) {
    const handleChange = (event) => {
        const lang = event.target.value;

        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);

        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    return (
        <select
            className={className}
            onChange={handleChange}
            defaultValue={localStorage.getItem("lang") || "en"}
            style={{ 
                display: "flex",
                alignItems: "center",
                gap: "12px",
                margin: "16px 0 24px 0"
            }}
        >
            <option value="en">English</option>
            <option value="ja">日本語 / Japanese</option>
            <option value="ru">Русский / Russian</option>
            <option value="ar">العربية / Arabic</option>
        </select>
    );
}
