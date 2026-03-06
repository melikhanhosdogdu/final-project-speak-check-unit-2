package com.mike.speak_check.enums;

public enum Language {
    ENGLISH("en"),
    SPANISH("es"),
    FRENCH("fr"),
    GERMAN("de"),

    KOREAN("ko"),
    JAPANESE("ja"),
    CHINESE("zh"),
    ITALIAN("it"),
    PORTUGUESE("pt"),
    RUSSIAN("ru");

    private final String code;

    Language(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
