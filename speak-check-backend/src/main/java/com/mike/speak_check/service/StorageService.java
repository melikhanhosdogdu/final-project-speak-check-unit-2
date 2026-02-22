package com.mike.speak_check.service;

import com.mike.speak_check.dto.request.CreateUploadRequestDTO;
import com.mike.speak_check.dto.response.CreateUploadResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
public class StorageService {
    @Value("${app.s3.bucket}")
    private String bucket;

    private final  S3Presigner s3Presigner;

    public StorageService( S3Presigner s3Presigner ) {
        this.s3Presigner = s3Presigner;
    }


    public CreateUploadResponseDTO generateUploadUrl(String userId, CreateUploadRequestDTO request, String basePath) {
        String key = basePath + "/" + userId + "/" + UUID.randomUUID() + "." + request.ext(); // webm/wav/mp3

        PutObjectRequest putReq = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(request.contentType()) // "audio/webm" vs
                .build();

        PutObjectPresignRequest presignReq = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(3))
                .putObjectRequest(putReq)
                .build();

        String url = s3Presigner.presignPutObject(presignReq).url().toString();
        return new CreateUploadResponseDTO(url, key);
    }

    public String generateDownloadUrl(String key) {
        GetObjectRequest getReq = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignReq =
                GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(10))
                        .getObjectRequest(getReq)
                        .build();

       return s3Presigner.presignGetObject(presignReq)
                .url()
                .toString();
    }

}
