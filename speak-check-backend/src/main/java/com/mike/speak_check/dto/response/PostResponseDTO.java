package com.mike.speak_check.dto.response;

import com.mike.speak_check.enums.Language;

import java.time.LocalDateTime;
import java.util.UUID;

public record PostResponseDTO(UUID id,
                              String username,
                              String text,
                              String audioUrl,
                              String backgroundImageUrl,
                              Language language,
                              int likeCount,
                              int commentCount,
                              boolean isLikedByCurrentUser,
                              LocalDateTime createdAt
) {

}

