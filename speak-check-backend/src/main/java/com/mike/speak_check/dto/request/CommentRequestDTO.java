package com.mike.speak_check.dto.request;

public record CommentRequestDTO(
        String text,
        String audioKey,
        String backgroundImageUrl
) {}