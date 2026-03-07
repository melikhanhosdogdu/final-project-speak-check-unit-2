package com.mike.speak_check.controller;

import com.mike.speak_check.dto.request.CommentRequestDTO;
import com.mike.speak_check.dto.response.CommentResponseDTO;
import com.mike.speak_check.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentResponseDTO> createComment(
            Authentication auth,
            @PathVariable UUID postId,
            @RequestBody CommentRequestDTO dto) {

        UUID userId = UUID.fromString(auth.getPrincipal().toString());
        System.out.println(auth.getPrincipal());
        return ResponseEntity.ok(
                commentService.createComment(postId, userId, dto)
        );
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDTO>> getComments(
            Authentication auth,
            @PathVariable UUID postId) {

        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        return ResponseEntity.ok(
                commentService.getComments(postId, userId)
        );
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeComment(
            Authentication auth,
            @PathVariable UUID id) {

        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        commentService.likeComment(id, userId);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<Void> unlikeComment(
            Authentication auth,
            @PathVariable UUID id) {

        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        commentService.unlikeComment(id, userId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{commentId}/posts/{postId}")
    public ResponseEntity<Void> deleteComment(
            Authentication auth,
            @PathVariable UUID commentId,
    @PathVariable UUID postId
    ) {
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        commentService.deleteComment(commentId,userId, postId);
        return ResponseEntity.noContent().build();
    }
}
