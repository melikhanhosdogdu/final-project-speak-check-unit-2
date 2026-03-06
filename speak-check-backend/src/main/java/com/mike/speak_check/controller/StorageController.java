package com.mike.speak_check.controller;

import com.mike.speak_check.dto.request.CreateUploadRequestDTO;
import com.mike.speak_check.dto.response.CreateUploadResponseDTO;
import com.mike.speak_check.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;


@RestController()
@RequestMapping("/storage")
@RequiredArgsConstructor
public class StorageController {
    private final S3Presigner s3Presigner;
    private final StorageService storageService;

    @PutMapping("/generate-upload-url")
    public ResponseEntity<CreateUploadResponseDTO> generateUploadUrl(Authentication auth, @RequestBody CreateUploadRequestDTO request) {

        String userId = auth.getPrincipal().toString();

        CreateUploadResponseDTO responseDTO = storageService.generateUploadUrl(userId, request, "audio");

        return ResponseEntity.ok().body(responseDTO);

    }

    @GetMapping ("/generate-download-url")
    public ResponseEntity<String> generateDownloadUrl(@RequestParam String key) {
        String url = storageService.generateDownloadUrl(key);
        return ResponseEntity.ok().body(url);
    }
}
