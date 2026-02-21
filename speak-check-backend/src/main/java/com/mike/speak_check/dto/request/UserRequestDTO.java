package com.mike.speak_check.dto.request;

import jakarta.validation.constraints.NotBlank;

import javax.validation.constraints.Size;

public class UserRequestDTO {
    @NotBlank(message = "Username is required")
    @Size(max = 50, message = "Username cannot exceed 50 characters")
    private String username;

        @NotBlank(message = "Password is required")
        @Size(min = 3, message = "Password must be at least 3 characters long")
    private String password;

        @NotBlank(message = "Email is required")
        @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;


    public UserRequestDTO(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
