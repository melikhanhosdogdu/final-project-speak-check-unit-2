import Card from "./Card";

function PostCard({
  id,
  userName,
  keyword,
  audioURL,
  backgroundImageUrl,
  commentCount = 0,
  likeCount = 0,
  isLikedByCurrentUser = false,
  onLikeToggle,
  onCommentClick,
  onAddCommentClick,
  canDelete = false,
  onDelete,
  canEdit = false,
  onEdit,
  hideAddCommentButton,
}) {
  return (
    <Card
      id={id}
      userName={userName}
      keyword={keyword}
      audioURL={audioURL}
      backgroundImageUrl={backgroundImageUrl}
      commentCount={commentCount}
      likeCount={likeCount}
      isLikedByCurrentUser={isLikedByCurrentUser}
      onLikeToggle={onLikeToggle}
      onCommentClick={onCommentClick}
      onAddCommentClick={onAddCommentClick}
      showComment={true}
      canDelete={canDelete}
      onDelete={onDelete}
      canEdit={canEdit}
      onEdit={onEdit}
      hideAddCommentButton={hideAddCommentButton}
    />
  );
}

export default PostCard;
