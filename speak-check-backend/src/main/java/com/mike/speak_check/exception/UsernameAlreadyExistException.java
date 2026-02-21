package com.mike.speak_check.exception;

public class UsernameAlreadyExistException extends RuntimeException {
    public UsernameAlreadyExistException(String message) {
        super(message);
    }
}
