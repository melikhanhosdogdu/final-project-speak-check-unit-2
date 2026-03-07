package com.mike.speak_check.repository;

import com.mike.speak_check.model.Comment;
import com.mike.speak_check.model.CommentLike;
import com.mike.speak_check.model.CommentLikeId;
import com.mike.speak_check.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLikeId> {

    boolean existsByCommentAndUser(Comment comment, User user);

    Optional<CommentLike> findByCommentAndUser(Comment comment, User user);

    void deleteByCommentAndUser(Comment comment, User user);

    boolean existsByCommentIdAndUserId(UUID commentId, UUID userId);
}