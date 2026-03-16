import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import Button from "../../components/Button";
import Input from "../../components/Input";

function QuizArea({
  audioURL,
  correctAnswer,
  onCorrectAnswer,
  onWrongAnswer,
  quizCompleted,
  onRestart,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showError, setShowError] = useState(null);
  const audioRef = useRef(null);

  const isAnswerValid = () => {
    return (
      correctAnswer.toLowerCase().trim() === inputValue.toLowerCase().trim()
    );
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    if (isAnswerValid()) {
      onCorrectAnswer(inputValue);
      setInputValue("");
      setShowError(false);
    } else {
      onWrongAnswer();
      setShowError(true);
    }
    setTimeout(() => {
      setShowError(null);
    }, 1000);
  };

  return (
    <div className="quiz-area">
      <div className="audio-player-container">
        <button className="play-button" onClick={handlePlayPause}>
          {isPlaying ? <Pause size={160} /> : <Play size={160} />}
        </button>
        <audio ref={audioRef} src={audioURL} onEnded={handleAudioEnded} />
      </div>
      {showError !== null && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="quiz-feedback-container">
            <p className={showError ? "quiz-error-text" : "quiz-success-text"}>
              {showError ? "Incorrect. Please try again!" : "Correct!"}
            </p>
          </div>
        </div>
      )}

      {quizCompleted ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p className="quiz-completed-text">Quiz Completed!</p>
          <Button
            onClick={onRestart}
            style={{ marginTop: "8px", width: "200px" }}
          >
            Restart Quiz
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="quiz-form">
          <Input
            style={{
              width: "60%",
            }}
            label="Type What You Hear"
            placeholder="Placeholder"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            style={{
              width: "60%",
              marginBottom: "12px",
            }}
            type="submit"
          >
            Submit
          </Button>
        </form>
      )}
    </div>
  );
}

export default QuizArea;
