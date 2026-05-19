package com.learningplatform.dto;

import lombok.*;

/**
 * Lesson DTO for content delivery.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonDto {

    private Long id;
    private Long courseId;
    private String courseName;
    private String title;
    private String content;
    private Integer orderIndex;
    private boolean completed;
    private String videoUrl;
    private String attachmentsUrl;
    private java.time.LocalDateTime scheduledDate;
}
