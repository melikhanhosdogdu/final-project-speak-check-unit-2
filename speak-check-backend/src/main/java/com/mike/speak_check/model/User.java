package com.mike.speak_check.model;

import com.mike.speak_check.enums.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
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

    private short aiReviewCount = 0;


    @Column(name = "createdAt", nullable = false)
    private LocalDateTime createdAt;

    public User() {

    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;

    public User(UUID id, String username, String email, String password, UserRole role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = password;
        this.role = role;
    }

    public void incrementAiReviewCount() {
        this.aiReviewCount++;
    }


}
