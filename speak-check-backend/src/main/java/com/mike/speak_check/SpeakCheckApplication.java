package com.mike.speak_check;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SpeakCheckApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpeakCheckApplication.class, args);
	}

}
