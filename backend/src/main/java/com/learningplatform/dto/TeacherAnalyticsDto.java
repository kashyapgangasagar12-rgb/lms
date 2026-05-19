package com.learningplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherAnalyticsDto {
    private long totalAssignments;
    private long totalSubmissions;
    private long pendingGrades;
    private double averageScore;
    private long totalStudents;
    private List<AssignmentTrend> trends;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignmentTrend {
        private String title;
        private double averageScore;
    }
}
