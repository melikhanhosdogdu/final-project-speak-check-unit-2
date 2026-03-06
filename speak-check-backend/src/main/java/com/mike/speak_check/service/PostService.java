package com.mike.speak_check.service;

import com.mike.speak_check.dto.request.PostRequestDTO;
import com.mike.speak_check.dto.response.PostResponseDTO;
import com.mike.speak_check.exception.UserNotFoundException;
import com.mike.speak_check.mapper.PostMapper;
import com.mike.speak_check.model.Post;
import com.mike.speak_check.model.User;
import com.mike.speak_check.repository.PostRepository;
import com.mike.speak_check.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private  final StorageService storageService;
    private  final UserRepository userRepository;
    private final AiReviewService aiReviewService;


   public PostResponseDTO createPost(PostRequestDTO postRequestDTO, UUID userId) {
       User user = userRepository.findById(userId)
               .orElseThrow(() -> new UserNotFoundException("User not found"));

       Post newPost = new Post();
       newPost.setUser(user);
       newPost.setText(postRequestDTO.text());
       newPost.setAudioKey(postRequestDTO.audioKey());
       newPost.setLanguage(postRequestDTO.language());
       newPost.setBackgroundImageUrl(postRequestDTO.backgroundImageUrl());


       Post savedPost =  postRepository.save(newPost);
       String audioUrl = storageService.generateDownloadUrl(newPost.getAudioKey());

       // TODO: Call AI service to analyze the audio and comment the post with the results (e.g., pronunciation score, feedback, etc.)

       if (user.getAiReviewCount() < 5) {
           // Asynchronously review the post content using AI
           aiReviewService.reviewPostContent(user.getId());
       }

       return PostMapper.toPostResponseDTO(savedPost, audioUrl, false);
   }

   public List<PostResponseDTO> getPosts() {
        List<Post> post  =  postRepository.findAll();
        return post.stream().map(p -> {
            String audioUrl = storageService.generateDownloadUrl(p.getAudioKey());
            // TODO: implement  isLikedByCurrentUser
            return PostMapper.toPostResponseDTO(p, audioUrl, false);
        }).toList();

    }

}
