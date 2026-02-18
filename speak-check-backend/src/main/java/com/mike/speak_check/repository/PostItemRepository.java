package com.mike.speak_check.repository;

import com.mike.speak_check.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PostItemRepository extends JpaRepository<Post, UUID> {
}