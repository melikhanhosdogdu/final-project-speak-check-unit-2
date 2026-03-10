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

        UUID userId = UUID.fromString(auth.getPrincipal().toString());
        PostResponseDTO postResponseDTO = postService.createPost(postRequestDTO, userId);
        return ResponseEntity.ok().body(postResponseDTO);
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getAll(Authentication auth) {
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        List<PostResponseDTO> postResponseDTOS  =  postService.getPosts(userId);
        return ResponseEntity.ok().body(postResponseDTOS);
    }

    @GetMapping("/me")
    public ResponseEntity<List<PostResponseDTO>> getMyAllPost(Authentication auth) {
        UUID userId = UUID.fromString(auth.getPrincipal().toString());

        List<PostResponseDTO> postResponseDTOS  =  postService.getMyAllPost(userId);
        return ResponseEntity.ok().body(postResponseDTOS);
    }


    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(
            Authentication auth,
            @PathVariable UUID id) {
        UUID userId = UUID.fromString(auth.getPrincipal().toString());
        postService.likePost(id,userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<Void> unlikePost(
            Authentication auth,
            @PathVariable UUID id)
    {        UUID userId = UUID.fromString(auth.getPrincipal().toString());
        postService.unlikePost(id, userId);
        return ResponseEntity.ok().build();
    }
}