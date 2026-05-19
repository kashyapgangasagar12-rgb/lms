package com.learningplatform.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long courseId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
