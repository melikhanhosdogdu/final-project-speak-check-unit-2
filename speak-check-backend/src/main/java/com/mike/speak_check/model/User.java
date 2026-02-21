package com.mike.speak_check.model;

import com.mike.speak_check.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import javax.validation.constraints.NotNull;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    // username, email, password, role (admin, user),  etc.

    @Id
    @GeneratedValue (strategy =  GenerationType.AUTO)
    private UUID id;

    @NotNull(message = "Username is required")
    private String username;

    @NotNull(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @NotNull
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;
    @NotNull
    @Enumerated(EnumType.STRING)
    private UserRole role;

    private boolean isEmailNotificationEnabled = true;


//  TODO  @Column(name="created_at", nullable = false)
//    private LocalDateTime createdAt;

    public User(UUID id, String username, String email, String password, UserRole role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = password;
        this.role = role;
    }

    public User() {

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return passwordHash;
    }

    public void setPassword(String password) {
        this.passwordHash = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isEmailNotificationEnabled() {
        return isEmailNotificationEnabled;
    }

    public void setEmailNotificationEnabled(boolean emailNotificationEnabled) {
        isEmailNotificationEnabled = emailNotificationEnabled;
    }
}
