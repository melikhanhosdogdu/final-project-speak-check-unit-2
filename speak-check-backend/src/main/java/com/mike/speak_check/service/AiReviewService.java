package com.mike.speak_check.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AiReviewService {

    private final PostService postService;
//    private final CommmentService commmentService;
    private final UserService userService;
    @Async
    public void reviewPostContent(UUID postId) {
        // Simulate AI review process
        try {
            Thread.sleep(5000); // Simulate time-consuming AI processing
            System.out.println("AI review completed for post: " + postId);
            // Here you would implement the actual AI review logic and update the post status accordingly


            // After successful review, you might want to update the user's AI review count or provide feedback
            // For example:
//             userService.incrementAiReviewCount(userId);
            // commmentService.addComment(postId, "AI review completed. Your pronunciation score is
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("AI review interrupted for post: " + postId);
        }
    }
}
