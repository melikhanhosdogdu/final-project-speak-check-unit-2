package com.mike.speak_check.service;

import com.mike.speak_check.dto.request.CommentRequestDTO;
import com.mike.speak_check.dto.response.CommentResponseDTO;
import com.mike.speak_check.model.*;
import com.mike.speak_check.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final CommentLikeRepository commentLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional
    public CommentResponseDTO createComment(
            UUID postId,
            UUID userId,
            CommentRequestDTO dto
    ) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));


        post.increasedCommentCount();
        postRepository.save(post);

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setText(dto.text());
        comment.setAudioKey(dto.audioKey());
        comment.setBackgroundImageUrl(dto.backgroundImageUrl());

        Comment saved = commentRepository.save(comment);
        String audioUrl = storageService.generateDownloadUrl(saved.getAudioKey());
        return new CommentResponseDTO(
                saved.getId(),
                user.getId(),
                user.getUsername(),
                saved.getText(),
                audioUrl,
                saved.getBackgroundImageUrl(),
                saved.getLikeCount(),
                false,
                saved.getCreatedAt()
        );
    }

    @Transactional
    public List<CommentResponseDTO> getComments(UUID postId, UUID userId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        List<Comment> comments = commentRepository.findByPost(post);



        return comments.stream().map(c -> {

            boolean liked = commentLikeRepository
                    .existsByCommentIdAndUserId(c.getId(), userId);

            String audioUrl = storageService.generateDownloadUrl(c.getAudioKey());
            System.out.println(c.getText());
            return new CommentResponseDTO(
                    c.getId(),
                    c.getUser().getId(),
                    c.getUser().getUsername(),
                    c.getText(),
                    audioUrl,
                    c.getBackgroundImageUrl(),
                    c.getLikeCount(),
                    liked,
                    c.getCreatedAt()
            );

        }).toList();
    }

    @Transactional
    public void likeComment(UUID commentId, UUID userId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean alreadyLiked =
                commentLikeRepository.existsByCommentAndUser(comment, user);

        if (alreadyLiked) return;

        CommentLike like = new CommentLike();
        like.setComment(comment);
        like.setUser(user);

        commentLikeRepository.save(like);

        comment.setLikeCount(comment.getLikeCount() + 1);
    }

    @Transactional
    public void unlikeComment(UUID commentId, UUID userId) {

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean liked =
                commentLikeRepository.existsByCommentAndUser(comment, user);

        if (!liked) return;

        commentLikeRepository.deleteByCommentAndUser(comment, user);

        comment.setLikeCount(Math.max(0, comment.getLikeCount() - 1));
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID userId, UUID postId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.decreasedCommentCount();
        postRepository.save(post);
        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("You cannot delete this comment");
        }

        commentRepository.delete(comment);
    }
}