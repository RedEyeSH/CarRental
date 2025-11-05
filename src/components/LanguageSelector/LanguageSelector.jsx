import i18n from "../../i18n";

export default function LanguageSelector() {
  const handleChange = (event) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  };

  return (
    <select
      onChange={handleChange}
      defaultValue={localStorage.getItem("lang") || "en"}
      style={{ padding: "6px", borderRadius: "6px" }}
    >
      <option value="en">English</option>
      <option value="ja">日本語 / Japanese</option>
      <option value="ru">Русский / Russian</option>
    </select>
  );
}
