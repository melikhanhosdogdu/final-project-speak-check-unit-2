package com.mike.speak_check.repository;

import com.mike.speak_check.model.Comment;
import com.mike.speak_check.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByPost(Post post);

}
