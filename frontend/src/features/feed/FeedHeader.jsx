import { Plus } from "lucide-react";
import LanguageSelector from "../../components/LanguageSelector";
import "./FeedHeader.css";

function FeedHeader({
  supportedLanguages,
  selectedLanguage,
  onLanguageChange,
  onAddPostClick,
}) {
  return (
    <header className="feed-header">
      <div className="header-title-button-area">
        <h1 className="feed-title">Home</h1>
        <button className="add-button" onClick={onAddPostClick}>
          <Plus size={24} />
        </button>
      </div>
      <LanguageSelector
        languages={supportedLanguages}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
      />
    </header>
  );
}

export default FeedHeader;
