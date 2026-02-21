package com.mike.speak_check.mapper;

import com.mike.speak_check.dto.request.UserRequestDTO;
import com.mike.speak_check.dto.response.LoginResponseDTO;
import com.mike.speak_check.dto.response.RegisterResponseDTO;
import com.mike.speak_check.dto.response.UserResponseDTO;
import com.mike.speak_check.enums.UserRole;
import com.mike.speak_check.model.User;

public class UserMapper {
    public static UserResponseDTO toUserResponseDTO(User user) {
        return new UserResponseDTO(user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    public static RegisterResponseDTO toRegisterResponseDTO(User user, String token) {
        UserResponseDTO userResponseDTO = toUserResponseDTO(user);
        return new RegisterResponseDTO(userResponseDTO, token);
    }

        public static LoginResponseDTO toLoginResponseDTO(User user, String token) {
            UserResponseDTO userResponseDTO = toUserResponseDTO(user);
            return new LoginResponseDTO(userResponseDTO, token);
        }

    public static User toModel(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setUsername(userRequestDTO.getUsername());
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(userRequestDTO.getPassword());
        user.setRole(UserRole.USER);
        return user;
    }
}
