import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = ({ className }) => {
    const { i18n } = useTranslation();
    
    // Extract base language code (e.g., 'en' from 'en-US')
    const getBaseLanguage = (lng) => {
        return lng?.split('-')[0] || 'en';
    };

    const [currentLanguage, setCurrentLanguage] = useState(getBaseLanguage(i18n.language));

    useEffect(() => {
        // Update current language on mount
        setCurrentLanguage(getBaseLanguage(i18n.language));

        // Listen for language changes
        const handleLanguageChange = (lng) => {
            setCurrentLanguage(getBaseLanguage(lng));
        };

        i18n.on('languageChanged', handleLanguageChange);

        // Cleanup listener on unmount
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <select
            value={currentLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
            className={className || ""}
        >
            <option value="en">English</option>
            <option value="ru">Русский / Russian</option>
            <option value="ja">日本語 / Japanese</option>
            <option value="ar">العربية / Arabic</option>
        </select>
    );
};

export default LanguageSelector;