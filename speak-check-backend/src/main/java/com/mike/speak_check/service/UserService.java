package com.mike.speak_check.service;

import com.mike.speak_check.dto.request.LoginRequestDTO;
import com.mike.speak_check.dto.request.UserRequestDTO;
import com.mike.speak_check.dto.response.LoginResponseDTO;
import com.mike.speak_check.dto.response.RegisterResponseDTO;
import com.mike.speak_check.dto.response.UserResponseDTO;
import com.mike.speak_check.exception.EmailAlreadyExistException;
import com.mike.speak_check.exception.UserNotFoundException;
import com.mike.speak_check.exception.UsernameAlreadyExistException;
import com.mike.speak_check.mapper.UserMapper;
import com.mike.speak_check.model.User;
import com.mike.speak_check.repository.UserRepository;
import com.mike.speak_check.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public RegisterResponseDTO register(UserRequestDTO user, PasswordEncoder passwordEncoder , JwtService jwtService) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new EmailAlreadyExistException("A user with this email already exists :" + user.getEmail());
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new UsernameAlreadyExistException("A user with this username already exists :" + user.getUsername());
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User newUser = userRepository.save(UserMapper.toModel(user));
        String token = jwtService.generateToken(newUser);
        return UserMapper.toRegisterResponseDTO(newUser, token);

    }

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO, PasswordEncoder passwordEncoder, JwtService jwtService) {
        User user = userRepository.findByEmail(loginRequestDTO.email())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + loginRequestDTO.email()));

        if (!passwordEncoder.matches(loginRequestDTO.password(), user.getPassword())) {
            throw new UserNotFoundException("Invalid credentials for email: " + loginRequestDTO.email());
        }

        String token = jwtService.generateToken(user);
        return UserMapper.toLoginResponseDTO(user, token);
    }

    public UserResponseDTO getUserById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
        return UserMapper.toUserResponseDTO(user);
    }

}
