package com.mike.speak_check.dto.response;

public record LoginResponseDTO(UserResponseDTO user, String token) {
}
