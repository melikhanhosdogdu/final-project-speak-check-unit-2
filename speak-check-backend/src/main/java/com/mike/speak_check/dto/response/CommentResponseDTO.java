package com.mike.speak_check.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentResponseDTO(
        UUID id,
        UUID userId,
        String userName,
        String text,
        String audioUrl,
        String backgroundImageUrl,
        int likeCount,
        boolean likedByCurrentUser,
        LocalDateTime createdAt
) {}