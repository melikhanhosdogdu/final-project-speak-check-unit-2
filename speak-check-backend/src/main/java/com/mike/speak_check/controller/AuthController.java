package com.mike.speak_check.controller;

import com.mike.speak_check.dto.request.LoginRequestDTO;
import com.mike.speak_check.dto.request.UserRequestDTO;
import com.mike.speak_check.dto.response.LoginResponseDTO;
import com.mike.speak_check.dto.response.RegisterResponseDTO;
import com.mike.speak_check.dto.validators.CreateUserValidationGroup;
import com.mike.speak_check.dto.validators.LoginValidationGroup;
import com.mike.speak_check.security.JwtService;
import com.mike.speak_check.service.UserService;
import jakarta.validation.groups.Default;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> createUser(@Validated({Default.class, CreateUserValidationGroup.class}) @RequestBody UserRequestDTO userRequestDTO) {
        RegisterResponseDTO registerResponseDTO = userService.register(userRequestDTO, passwordEncoder, jwtService);
        return ResponseEntity.ok().body(registerResponseDTO);
    }

      @PostMapping("/login")
        public ResponseEntity<LoginResponseDTO> loginUser(@Validated({Default.class, LoginValidationGroup.class}) @RequestBody LoginRequestDTO loginRequestDTO) {
            LoginResponseDTO loginResponseDTO = userService.login(loginRequestDTO, passwordEncoder, jwtService);
            return ResponseEntity.ok().body(loginResponseDTO);
        }
}
