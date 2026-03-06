package com.mike.speak_check.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(name = "audio_key", length = 512)
    private String audioKey;

    @Column(name = "background_image_url", columnDefinition = "TEXT")
    private String backgroundImageUrl;

    @Column(name = "like_count", nullable = false)
    private int likeCount = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Comment.java içine ekleyin
    @OneToMany(mappedBy = "comment", cascade = CascadeType.ALL)
    private List<CommentLike> likes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}