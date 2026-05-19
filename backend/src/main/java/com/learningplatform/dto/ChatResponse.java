package com.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String message;
    private String timestamp;
    private boolean isAi;

    public ChatResponse(String message, boolean isAi) {
        this.message = message;
        this.isAi = isAi;
        this.timestamp = java.time.LocalDateTime.now().toString();
    }
}
