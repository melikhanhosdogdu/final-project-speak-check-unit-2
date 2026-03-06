package com.mike.speak_check.controller;

import com.mike.speak_check.dto.request.PostRequestDTO;
import com.mike.speak_check.dto.response.PostResponseDTO;
import com.mike.speak_check.model.Post;
import com.mike.speak_check.repository.PostRepository;
import com.mike.speak_check.service.PostService;
import com.mike.speak_check.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;


    @PostMapping
    public ResponseEntity<PostResponseDTO> create(
            Authentication auth, @RequestBody PostRequestDTO postRequestDTO) {

        System.out.println("Received post creation request: " + postRequestDTO);
        UUID userId = UUID.fromString(auth.getPrincipal().toString());
        PostResponseDTO postResponseDTO = postService.createPost(postRequestDTO, userId);
        return ResponseEntity.ok().body(postResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getAll() {
        List<PostResponseDTO> postResponseDTOS  =  postService.getPosts();
        return ResponseEntity.ok().body(postResponseDTOS);
    }

    // Like a post
    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(@PathVariable UUID id) {
//        postService.likePost(id);
        return ResponseEntity.ok().build();
    }

    // Unlike a post
    @PostMapping("/{id}/unlike")
    public ResponseEntity<Void> unlikePost(@PathVariable UUID id)
    {
//        postService.unlikePost(id);
        return ResponseEntity.ok().build();
    }
}