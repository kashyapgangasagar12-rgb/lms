package com.learningplatform.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssignmentDto {
    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private Integer maxMarks;
    private List<Long> studentIds;
    private String grade;
    private String feedback;
}
