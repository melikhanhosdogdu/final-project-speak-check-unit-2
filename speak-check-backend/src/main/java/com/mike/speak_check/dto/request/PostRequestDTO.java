package com.mike.speak_check.dto.request;

import com.mike.speak_check.enums.Language;

public record PostRequestDTO (
                              String text,
                              String audioKey,
                              Language language,
                              String backgroundImageUrl
                              ) {
}
