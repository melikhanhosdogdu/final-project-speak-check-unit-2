import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import PostCard from "../../shared/components/PostCard";
import CommentsOfPost from "../../shared/components/CommetsOfPost";
import ProfileHeader from "./ProfileHeader";
import EditPostModal from "./EditPostModal";
import "./ProfilePage.css";

import { postAPI, commentAPI } from "../../shared/api/api";

function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getMyPosts();
      setPosts(response.data);
      setIsPostsLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setIsPostsLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    const comment = (await commentAPI.getCommentsOfPost(postId)).data;
    return comment;
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCommentClick = async (postId) => {
    setSelectedPostId(postId);
    await initComments(postId);
  };

  const initComments = async (postId) => {
    try {
      setIsCommentsLoading(true);
      const data = await fetchComments(postId);
      setIsCommentsLoading(false);

      addComments(postId, data);
    } catch (error) {
      setIsCommentsLoading(false);
      console.error("Fetching comments has failed", error);
    }
  };

  const addComments = (postId, initComments) => {
    setComments((prevComments) => {
      const postComments = prevComments[postId] || [];

      if (postComments.length > 0) {
        return {
          ...prevComments,
        };
      }

      return {
        ...prevComments,
        [postId]: [...initComments, ...postComments],
      };
    });
  };

  const handleCommentLikeToggle = async (commentId) => {
    let isLiked = false;

    Object.values(comments).forEach((postComments) => {
      const comment = postComments.find((c) => c.id === commentId);
      if (comment) {
        isLiked = comment.likedByCurrentUser;
      }
    });

    try {
      if (isLiked) {
        await commentAPI.unlike(commentId);
      } else {
        await commentAPI.like(commentId);
      }
    } catch (error) {
      console.error("Like / Unlike error", error);
      return;
    }

    setComments((prevComments) => {
      const updatedComments = {};

      Object.keys(prevComments).forEach((postId) => {
        updatedComments[postId] = prevComments[postId].map((comment) => {
          if (comment.id !== commentId) return comment;

          const newLiked = !comment.likedByCurrentUser;

          return {
            ...comment,
            likedByCurrentUser: newLiked,
            likeCount: newLiked ? comment.likeCount + 1 : comment.likeCount - 1,
          };
        });
      });

      return updatedComments;
    });
  };

  const handlePostDelete = async (postId) => {
    try {
      await postAPI.delete(postId);
    } catch (error) {
      console.error("Post cant deleted", error);
      return;
    }

    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));

    setComments((prevComments) => {
      const updatedComments = { ...prevComments };
      delete updatedComments[postId];
      return updatedComments;
    });

    if (selectedPostId === postId) {
      setSelectedPostId(null);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === updatedPost.id ? { ...p, ...updatedPost } : p,
      ),
    );
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await commentAPI.delete(commentId, selectedPostId);
    } catch (error) {
      console.error("Comments cant deleted", error);
      return;
    }

    setComments((prevComments) => {
      const updatedComments = { ...prevComments };

      updatedComments[selectedPostId] = updatedComments[selectedPostId].filter(
        (comment) => comment.id !== commentId,
      );

      return updatedComments;
    });
  };

  return (
    <div className="profile-page">
      <ProfileHeader />

      <EditPostModal
        isOpen={editingPost !== null}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onPostUpdated={handlePostUpdated}
      />

      {isPostsLoading ? (
        <div style={{ padding: "150px 300px" }}>
          <Loader2
            className="card-loading-icon"
            style={{ color: "black" }}
            size={40}
          />
        </div>
      ) : posts.length === 0 ? (
        <div className="no-posts-message">No posts available</div>
      ) : null}

      <div className="profile-content">
        <div className="profile-main">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              userName={post.username}
              keyword={post.text}
              audioURL={post.audioUrl}
              commentCount={post.commentCount}
              likeCount={post.likeCount}
              isLikedByCurrentUser={post.isLikedByCurrentUser}
              onLikeToggle={() => null}
              onCommentClick={() => handleCommentClick(post.id)}
              onAddCommentClick={() => null}
              canDelete={true}
              backgroundImageUrl={post.backgroundImageUrl}
              onDelete={() => handlePostDelete(post.id)}
              canEdit={true}
              onEdit={() => setEditingPost(post)}
              hideAddCommentButton={true}
            />
          ))}
        </div>

        {selectedPostId && (
          <div className="profile-sidebar">
            <CommentsOfPost
              postKeyword={
                posts.find((post) => post.id === selectedPostId)?.text || ""
              }
              comments={comments[selectedPostId] || []}
              onCommentLikeToggle={handleCommentLikeToggle}
              closeComments={() => setSelectedPostId(null)}
              canDelete={true}
              onDelete={handleCommentDelete}
              isCommentsLoading={isCommentsLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
