package com.mike.speak_check.dto.response;

public class RegisterResponseDTO {
    private UserResponseDTO user;
    private String token ;

    public RegisterResponseDTO(UserResponseDTO user, String token) {
        this.user = user;
        this.token = token;
    }

    public UserResponseDTO getUser() {
        return user;
    }

    public void setUser(UserResponseDTO user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
