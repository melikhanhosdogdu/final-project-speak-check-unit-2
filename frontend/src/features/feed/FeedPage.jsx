import { useEffect, useState, useMemo } from "react";
import FeedHeader from "./FeedHeader";
import PostCard from "../../shared/components/PostCard";
import CommentsOfPost from "../../shared/components/CommetsOfPost";
import RecordingModal from "./RecordingModal";
import AddCommentModal from "./AddCommentModal";
import { LANGUAGE_OPTIONS } from "../../utils/constants";
import "./FeedPage.css";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { commentAPI, postAPI } from "../../shared/api/api";

function FeedPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("ENGLISH");
  const [isAddingPostModalOpen, setIsAddingPostModalOpen] = useState(false);
  const [isAddingCommentModalOpen, setIsAddingCommentModalOpen] =
    useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const [selectedPostId, setSelectedPostId] = useState(null);

  const userName = JSON.parse(localStorage.getItem("user") || "null")?.username;

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAll();

      setPosts(response.data);
      setIsPostsLoading(false);
    } catch (error) {
      setIsPostsLoading(false);
      console.error("Failed to fetch posts:", error);
    }
  };

  const fectchComments = async (postId) => {
    const comment = (await commentAPI.getCommentsOfPost(postId)).data;
    return comment;
  };

  const likePost = async (id) => {
    try {
      const response = await postAPI.like(id);
      return response.status == 200;
    } catch (error) {
      console.error("Failed to like post:", error);
      return false;
    }
  };
  const unlikePost = async (id) => {
    try {
      const response = await postAPI.unlike(id);
      return response.status == 200;
    } catch (error) {
      console.error("Failed to unlike post:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setSelectedPostId(null);
  };

  const handleLikeToggle = async (postId, isLikedByCurrentUser) => {
    if (isLikedByCurrentUser) {
      const response = await unlikePost(postId);

      if (response === false) {
        return;
      }
    } else {
      const response = await likePost(postId);
      if (response === false) {
        // If api call fail do not update the state
        return;
      }
    }
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLikedByCurrentUser: !post.isLikedByCurrentUser,
              likeCount: post.isLikedByCurrentUser
                ? post.likeCount - 1
                : post.likeCount + 1,
            }
          : post,
      ),
    );
  };

  const handleCommentClick = async (postId) => {
    setSelectedPostId(postId);
    await initCommnets(postId);

    try {
    } catch (error) {
      setSelectedPostId(null);
      console.error("Fething comments has failed ", error);
    }
  };

  const handleAddCommentClick = (post) => {
    setSelectedPostForComment(post);
    setIsAddingCommentModalOpen(true);
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

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setSelectedLanguage(newPost.language);
    setSelectedPostId(null);
  };
  const addNewComment = (postId, newComment) => {
    setComments((prevComments) => {
      const postComments = prevComments[postId] || [];

      return {
        ...prevComments,
        [postId]: [newComment, ...postComments],
      };
    });

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentCount: post.commentCount + 1,
            }
          : post,
      ),
    );
    toast("Comitted successful!", {
      type: "success",
      position: "bottom-right",
    });
  };

  const initCommnets = async (selectedPostId) => {
    try {
      setIsCommentsLoading(true);
      const data = await fectchComments(selectedPostId);
      setIsCommentsLoading(false);

      addComments(selectedPostId, data);
    } catch (error) {
      setIsCommentsLoading(false);
      console.error("Fetcing comments has failed", error);
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

  const deleteComment = async (postId, commentId) => {
    try {
      await commentAPI.delete(commentId, postId);
    } catch (error) {
      console.error("Comments cant deleted", error);
      return;
    }

    setComments((prevComments) => {
      const postComments = prevComments[postId] || [];

      return {
        ...prevComments,
        [postId]: postComments.filter((c) => c.id !== commentId),
      };
    });

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentCount: Math.max(0, post.commentCount - 1),
            }
          : post,
      ),
    );
    toast("Delete successful!", {
      type: "success",
      position: "bottom-right",
    });
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => post.language === selectedLanguage);
  }, [posts, selectedLanguage]);

  return (
    <div className="feed-page">
      <RecordingModal
        isOpen={isAddingPostModalOpen}
        onClose={() => setIsAddingPostModalOpen(false)}
        onPostAdded={(newPost) => addNewPost(newPost)}
      />
      <AddCommentModal
        isOpen={isAddingCommentModalOpen}
        onClose={() => setIsAddingCommentModalOpen(false)}
        postKeyword={selectedPostForComment?.text}
        postId={selectedPostForComment?.id}
        onCommentAdded={(postId, newComment) =>
          addNewComment(postId, newComment)
        }
      />
      <FeedHeader
        supportedLanguages={LANGUAGE_OPTIONS}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onAddPostClick={() => setIsAddingPostModalOpen(true)}
      />

      {isPostsLoading ? (
        <div style={{ padding: "150px 300px" }}>
          {" "}
          <Loader2
            className="card-loading-icon"
            style={{
              color: "black",
            }}
            size={40}
          />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="no-posts-message">
          No posts available for {selectedLanguage}
        </div>
      ) : null}

      <div className="feed-content">
        <div className="feed-main">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              userName={post.username}
              keyword={post.text}
              audioURL={post.audioUrl}
              commentCount={post.commentCount}
              backgroundImageUrl={post.backgroundImageUrl}
              likeCount={post.likeCount}
              isLikedByCurrentUser={post.isLikedByCurrentUser || false}
              onLikeToggle={() =>
                handleLikeToggle(post.id, post.isLikedByCurrentUser)
              }
              onCommentClick={() => handleCommentClick(post.id)}
              onAddCommentClick={() => handleAddCommentClick(post)}
              canDelete={false}
              hideAddCommentButton={false}
            />
          ))}
        </div>
        {selectedPostId && (
          <div className="feed-sidebar">
            <CommentsOfPost
              postKeyword={
                posts.find((post) => post.id === selectedPostId)?.text || ""
              }
              comments={comments[selectedPostId] || []}
              onCommentLikeToggle={handleCommentLikeToggle}
              closeComments={() => setSelectedPostId(null)}
              onDelete={(commentId) => deleteComment(selectedPostId, commentId)}
              isCommentsLoading={isCommentsLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedPage;
