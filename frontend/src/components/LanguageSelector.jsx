import "./LanguageSelector.css";

function LanguageSelector({ languages, selectedLanguage, onLanguageChange }) {
  return (
    <div className="language-tabs">
      {languages.map((language) => (
        <button
          key={language.value}
          className={`language-tab ${
            selectedLanguage === language.value ? "active" : ""
          }`}
          onClick={() => onLanguageChange(language.value)}
        >
          {language.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;
