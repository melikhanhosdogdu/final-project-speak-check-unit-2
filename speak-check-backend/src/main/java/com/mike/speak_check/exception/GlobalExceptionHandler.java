package com.mike.speak_check.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,String>> handleValidationException(MethodArgumentNotValidException ex){
        log.error("Validation error : {}", ex.getMessage());
        Map<String,String> errors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> errors.put(error.getField(),error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(EmailAlreadyExistException.class)
    public ResponseEntity<Map<String,String>> handleEmailAlreadyExistException(EmailAlreadyExistException ex) {
        log.error("Email already exist : {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Email already exist");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(UsernameAlreadyExistException.class)
    public ResponseEntity<Map<String,String>> handleUsernameAlreadyExistException(UsernameAlreadyExistException ex) {
        log.error("Username already exist : {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Username already exist");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String,String>> handleUserNotFoundException(UserNotFoundException ex) {
        log.error("User not found : {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "User not found");
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,String>> handleGenericException(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        Map<String, String> errors = new HashMap<>();
        errors.put("message", "Internal server error: " + ex.getMessage());
        return ResponseEntity.internalServerError().body(errors);
    }
}
