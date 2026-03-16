package com.mike.speak_check.dto.request;

import com.mike.speak_check.enums.Language;

public record UpdatePostRequestDTO(
        String text,
        Language language
) {
}
