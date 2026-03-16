import { useState, useRef } from "react";
import { Play, Pause, MessageCircle, Heart, Plus, Trash2, Pencil } from "lucide-react";

import { getIconColor } from "../../utils/fetch-backgrounds-images";
import "./Card.css";

function Card({
  id,
  userName,
  keyword,
  audioURL = null,
  backgroundImageUrl,
  commentCount = 0,
  likeCount = 0,
  isLikedByCurrentUser = false,
  onLikeToggle,
  onCommentClick,
  onAddCommentClick,
  showComment = true,
  hideAddCommentButton = false,
  canDelete = false,
  onDelete,
  canEdit = false,
  onEdit,
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const isDarkTheme = getIconColor(backgroundImageUrl || "#ffffff") === "dark";

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

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-username-value">{userName}</span>
      </div>

      <div className="card-keyword">{keyword}</div>

      {audioURL && (
        <div
          className="card-audio-container"
          style={{
            backgroundImage: `url(${backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "transparent",
          }}
        >
          <button
            className={`card-play-button ${
              isDarkTheme ? "dark-theme" : "light-theme"
            }`}
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="card-play-icon" size={40} />
            ) : (
              <Play className="card-play-icon" size={40} />
            )}
          </button>

          <audio ref={audioRef} src={audioURL} onEnded={handleAudioEnded} />
        </div>
      )}

      <div className="card-actions">
        {!hideAddCommentButton && showComment && onAddCommentClick && (
          <button className="card-add-comment" onClick={onAddCommentClick}>
            <Plus size={20} />
            <span>Add comment</span>
          </button>
        )}

        <div className="card-stats">
          {showComment && (
            <button className="card-stat-button" onClick={onCommentClick}>
              <MessageCircle size={20} />
              <span>{commentCount}</span>
            </button>
          )}

          <button
            className={`card-stat-button ${isLikedByCurrentUser ? "liked" : ""}`}
            onClick={onLikeToggle}
          >
            <Heart
              size={20}
              fill={isLikedByCurrentUser ? "currentColor" : "none"}
            />
            <span>{likeCount}</span>
          </button>
        </div>
        {canEdit && (
          <button className="card-stat-button" onClick={onEdit}>
            <Pencil size={20} />
          </button>
        )}
        {canDelete && (
          <button
            style={{
              color: "red",
            }}
            className="card-stat-button card-delete"
            onClick={onDelete}
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Card;
