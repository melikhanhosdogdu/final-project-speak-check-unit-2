import { useState, useEffect } from "react";
import QuizArea from "./QuizArea";
import QuizHistory from "./History";
import LanguageSelector from "../../components/LanguageSelector";
import { LANGUAGE_OPTIONS } from "../../utils/constants";
import "./ListeningPage.css";
import Confetti from "react-confetti";

import { postAPI } from "../../shared/api/api";

function ListeningPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("ENGLISH");
  const [history, setHistory] = useState([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAll();

      const filtered = response.data.filter(
        (post) => post.language === selectedLanguage,
      );

      setQuestions(filtered);
      setCurrentQuestionIndex(0);
      setHistory([]);
      setAttemptCount(0);
      setQuizCompleted(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch quiz audios", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedLanguage]);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const QUIZ_LIMIT = 5;

  const handleCorrectAnswer = (keyword) => {
    const newHistoryItem = {
      keyword,
      attempts: attemptCount + 1,
    };

    const newHistory = [...history, newHistoryItem];
    setHistory(newHistory);
    setAttemptCount(0);

    if (newHistory.length >= QUIZ_LIMIT || currentQuestionIndex >= questions.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const startAgain = () => {
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setHistory([]);
    setAttemptCount(0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (isLoading) {
    return (
      <div className="listening-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="listening-page">
        <div className="listening-header">
          <LanguageSelector
            languages={LANGUAGE_OPTIONS}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        <div className="listening-content">
          <p>No audio posts available for {selectedLanguage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="listening-page">
      <header className="listening-header">
        <h1 className="listening-title">Listening</h1>

        <LanguageSelector
          languages={LANGUAGE_OPTIONS}
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
      </header>

      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={quizCompleted}
        numberOfPieces={quizCompleted ? 1000 : 0}
      />

      <div className="listening-content">
        <QuizArea
          audioURL={currentQuestion.audioUrl}
          correctAnswer={currentQuestion.text}
          onCorrectAnswer={handleCorrectAnswer}
          onWrongAnswer={() => setAttemptCount(attemptCount + 1)}
          quizCompleted={quizCompleted}
          onRestart={startAgain}
        />

        <QuizHistory history={history} />
      </div>
    </div>
  );
}

export default ListeningPage;
