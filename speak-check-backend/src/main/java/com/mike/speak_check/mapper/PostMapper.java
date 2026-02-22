package com.mike.speak_check.mapper;

import com.mike.speak_check.dto.request.PostRequestDTO;
import com.mike.speak_check.dto.response.PostResponseDTO;
import com.mike.speak_check.model.Post;

public class PostMapper {

    public static PostResponseDTO toPostResponseDTO(Post post, String audioUrl, boolean isLikedByCurrentUser) {
        return new PostResponseDTO(
                post.getId(),
                post.getUser().getUsername(),
                post.getText(),
                audioUrl,
                post.getBackgroundImageUrl(),
                post.getLanguage(),
                post.getLikeCount(),
                post.getCommentCount(),
                isLikedByCurrentUser,
                post.getCreatedAt()
        );
    }

}
