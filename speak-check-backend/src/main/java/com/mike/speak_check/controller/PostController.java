package com.mike.speak_check.controller;

import com.mike.speak_check.model.Post;
import com.mike.speak_check.repository.PostItemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    private final PostItemRepository repository;

    public PostController(PostItemRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Post create(@RequestBody Post item) {
        return repository.save(item);
    }

    @GetMapping
    public List<Post> getAll() {
        return repository.findAll();
    }
}