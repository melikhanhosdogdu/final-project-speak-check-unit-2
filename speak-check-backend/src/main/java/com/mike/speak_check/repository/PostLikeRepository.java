package com.mike.speak_check.repository;

import com.mike.speak_check.model.Post;
import com.mike.speak_check.model.PostLike;
import com.mike.speak_check.model.PostLikeId;
import com.mike.speak_check.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PostLikeRepository extends JpaRepository<PostLike, PostLikeId> {

    boolean existsByPostAndUser(Post post, User user);

    Optional<PostLike> findByPostAndUser(Post post, User user);

    boolean existsByPostIdAndUserId(UUID postId, UUID userId);

}