package com.learningplatform.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String message;
    private String topic;
    private String context;
}
