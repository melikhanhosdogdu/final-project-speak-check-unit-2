import Card from "./Card";

function CommentCard({
  id,
  userName,
  commentText,
  audioURL = null,
  backgroundImageUrl,
  commentCount = 0,
  likeCount = 0,
  isLikedByCurrentUser = false,
  onLikeToggle,
  canDelete = false,
  onDelete,
}) {
  return (
    <Card
      id={id}
      userName={userName}
      keyword={commentText}
      audioURL={audioURL}
      backgroundImageUrl={backgroundImageUrl}
      commentCount={commentCount}
      likeCount={likeCount}
      isLikedByCurrentUser={isLikedByCurrentUser}
      onLikeToggle={onLikeToggle}
      onCommentClick={() => {}}
      showComment={false}
      canDelete={canDelete}
      onDelete={onDelete}
    />
  );
}

export default CommentCard;
