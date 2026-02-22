package com.mike.speak_check.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CORSConfiguration;
import software.amazon.awssdk.services.s3.model.CORSRule;
import software.amazon.awssdk.services.s3.model.PutBucketCorsRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
public class S3Config {
    @Value("${app.s3.endpoint}")
    private String endpoint;

    @Value("${app.s3.region}")
    private String region;

    @Value("${app.s3.accessKey}")
    private String accessKey;

    @Value("${app.s3.secretKey}")
    private String secretKey;

    @Value("${app.s3.bucket}")
    private String bucket;

    private AwsCredentialsProvider creds() {
        return StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey));
    }

    @Bean
    public S3Client s3Client() {
        S3Client s3Client = S3Client.builder()
                .credentialsProvider(creds())
                .region(Region.of(region))
                .endpointOverride(URI.create(endpoint))
                .build();

        s3Client.putBucketCors(PutBucketCorsRequest.builder()
                .bucket(bucket)
                .corsConfiguration(CORSConfiguration.builder()
                        .corsRules(CORSRule.builder()
                                .allowedOrigins("http://localhost:5173", "https://speak-check.vercel.app")
                                .allowedMethods("GET", "PUT" , "POST", "DELETE")
                                .allowedHeaders("*")
                                .maxAgeSeconds(3600)
                                .build())
                        .build())
                .build());

        return s3Client;
    }

    @Bean
    public S3Presigner s3Presigner() {
        return S3Presigner.builder()
                .credentialsProvider(creds())
                .region(Region.of(region))
                .endpointOverride(URI.create(endpoint))
                .build();
    }
}
