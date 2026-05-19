package com.learningplatform.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubmissionDto {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String studentName;
    private String content;
    private String grade;
    private String feedback;
    private LocalDateTime submittedAt;
}
