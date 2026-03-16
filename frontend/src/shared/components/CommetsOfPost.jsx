import CommentCard from "./CommentCard";
import "./CommentsOfPost.css";
import { X } from "lucide-react";
import { Loader2 } from "lucide-react";
function CommentsOfPost({
  postKeyword,
  comments,
  onCommentLikeToggle,
  closeComments,
  onDelete,
  isCommentsLoading,
}) {
  const userName = JSON.parse(localStorage.getItem("user") || "null")?.username;

  return (
    <div className="comments-of-post">
      <div className="comments-header">
        <h2>Comments of {postKeyword}</h2>
        <button className="modal-close-button" onClick={closeComments}>
          <X size={24} />
        </button>
      </div>
      <div className="comments-list">
        {isCommentsLoading ? (
          <div style={{ padding: "50px 200px" }}>
            <Loader2
              className="card-loading-icon"
              style={{ color: "black" }}
              size={40}
            />
          </div>
        ) : comments.length === 0 ? (
          <p className="no-comments">No comments yet</p>
        ) : (
          comments.map((comment, index) => (
            <CommentCard
              key={comment.id ?? index}
              id={comment.id}
              userName={comment.userName}
              commentText={comment.text}
              audioURL={comment.audioUrl}
              backgroundImageUrl={comment.backgroundImageUrl}
              commentCount={comment.commentCount || 0}
              likeCount={comment.likeCount}
              isLikedByCurrentUser={comment.likedByCurrentUser}
              onLikeToggle={() => onCommentLikeToggle(comment.id)}
              canDelete={comment.userName == userName}
              onDelete={() => onDelete(comment.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentsOfPost;
