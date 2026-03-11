package com.mike.speak_check.service;

import com.mike.speak_check.dto.request.PostRequestDTO;
import com.mike.speak_check.dto.response.PostResponseDTO;
import com.mike.speak_check.exception.UserNotFoundException;
import com.mike.speak_check.mapper.PostMapper;
import com.mike.speak_check.model.Post;
import com.mike.speak_check.model.PostLike;
import com.mike.speak_check.model.User;
import com.mike.speak_check.repository.PostLikeRepository;
import com.mike.speak_check.repository.PostRepository;
import com.mike.speak_check.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final PostLikeRepository postLikeRepository;

    public PostResponseDTO createPost(PostRequestDTO postRequestDTO, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Post newPost = new Post();
        newPost.setUser(user);
        newPost.setText(postRequestDTO.text());
        newPost.setAudioKey(postRequestDTO.audioKey());
        newPost.setLanguage(postRequestDTO.language());
        newPost.setBackgroundImageUrl(postRequestDTO.backgroundImageUrl());

        Post savedPost = postRepository.save(newPost);
        String audioUrl = storageService.generateDownloadUrl(newPost.getAudioKey());

        return PostMapper.toPostResponseDTO(savedPost, audioUrl, false);
    }

    public List<PostResponseDTO> getPosts(UUID userId) {
        List<Post> post = postRepository.findAllByOrderByCreatedAtDesc();
        return post.stream().map(p -> {
            String audioUrl = storageService.generateDownloadUrl(p.getAudioKey());
            boolean liked = postLikeRepository.existsByPostIdAndUserId(p.getId(), userId);
            return PostMapper.toPostResponseDTO(p, audioUrl, liked);
        }).toList();
    }

    public List<PostResponseDTO> getMyAllPost(UUID userId) {
        List<Post> post = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return post.stream().map(p -> {
            String audioUrl = storageService.generateDownloadUrl(p.getAudioKey());
            boolean liked = postLikeRepository.existsByPostIdAndUserId(p.getId(), userId);
            return PostMapper.toPostResponseDTO(p, audioUrl, liked);
        }).toList();
    }

    @Transactional
    public void deletePost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    @Transactional
    public void likePost(UUID postId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean alreadyLiked = postLikeRepository.existsByPostAndUser(post, user);
        if (alreadyLiked) return;

        PostLike like = new PostLike();
        like.setPost(post);
        like.setUser(user);

        postLikeRepository.save(like);
        post.setLikeCount(post.getLikeCount() + 1);
    }

    @Transactional
    public void unlikePost(UUID postId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<PostLike> like = postLikeRepository.findByPostAndUser(post, user);
        if (like.isEmpty()) return;

        postLikeRepository.delete(like.get());
        post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
    }
}
