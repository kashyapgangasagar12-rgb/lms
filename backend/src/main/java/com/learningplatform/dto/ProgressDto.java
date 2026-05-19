package com.learningplatform.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressDto {
    private long completedLessons;
    private long totalLessons;
    private long submittedAssignments;
    private long totalAssignments;
    private double averageGrade;
}
