package com.learningplatform.service;

import com.learningplatform.dto.SubmissionDto;
import com.learningplatform.dto.AnalyticsDto;
import com.learningplatform.entity.Assignment;
import com.learningplatform.entity.Submission;
import com.learningplatform.entity.User;
import com.learningplatform.repository.AssignmentRepository;
import com.learningplatform.repository.SubmissionRepository;
import com.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public SubmissionDto submitAssignment(SubmissionDto dto) {
        Long assignmentId = dto.getAssignmentId();
        Long studentId = dto.getStudentId();
        if (assignmentId == null || studentId == null) {
            throw new IllegalArgumentException("Assignment ID and Student ID cannot be null");
        }
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Submission submission = submissionRepository
                .findByAssignmentIdAndStudentId(dto.getAssignmentId(), dto.getStudentId())
                .orElse(new Submission());

        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setContent(dto.getContent());
        submission.setSubmittedAt(LocalDateTime.now());

        Submission saved = submissionRepository.save(submission);
        return mapToDto(saved);
    }

    public SubmissionDto gradeSubmission(Long submissionId, String grade, String feedback) {
        if (submissionId == null) {
            throw new IllegalArgumentException("Submission ID cannot be null");
        }
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setGrade(grade);
        submission.setFeedback(feedback);
        Submission saved = submissionRepository.save(submission);
        return mapToDto(saved);
    }

    public List<SubmissionDto> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<SubmissionDto> getMySubmissions(Long studentId) {
        return submissionRepository.findByStudentId(studentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AnalyticsDto getStudentAnalytics(Long studentId) {
        List<Submission> submissions = submissionRepository.findByStudentId(studentId);
        List<AnalyticsDto.Trend> trends = submissions.stream()
                .filter(s -> s.getGrade() != null)
                .map(s -> AnalyticsDto.Trend.builder()
                        .attempt(0) // Will be set after sorting
                        .score(parseGrade(s.getGrade()))
                        .date(s.getSubmittedAt())
                        .build())
                .sorted((t1, t2) -> t1.getDate().compareTo(t2.getDate()))
                .collect(Collectors.toList());

        // Set attempt numbers
        for (int i = 0; i < trends.size(); i++) {
            trends.get(i).setAttempt(i + 1);
        }

        double average = trends.stream()
                .mapToDouble(AnalyticsDto.Trend::getScore)
                .average()
                .orElse(0.0);

        return AnalyticsDto.builder()
                .overallStats(AnalyticsDto.OverallStats.builder()
                        .totalAttempts(trends.size())
                        .averageScore(average)
                        .build())
                .trends(trends)
                .build();
    }

    private double parseGrade(String grade) {
        if (grade == null)
            return 0.0;
        try {
            return Double.parseDouble(grade.replaceAll("[^\\d.]", ""));
        } catch (NumberFormatException e) {
            String g = grade.trim().toUpperCase();
            if (g.startsWith("A"))
                return 95.0;
            if (g.startsWith("B"))
                return 85.0;
            if (g.startsWith("C"))
                return 75.0;
            if (g.startsWith("D"))
                return 65.0;
            if (g.startsWith("F"))
                return 50.0;
            return 0.0;
        }
    }

    private SubmissionDto mapToDto(Submission s) {
        SubmissionDto dto = new SubmissionDto();
        dto.setId(s.getId());
        Assignment assignment = s.getAssignment();
        if (assignment != null) {
            dto.setAssignmentId(assignment.getId());
        }
        User student = s.getStudent();
        if (student != null) {
            dto.setStudentId(student.getId());
            dto.setStudentName(student.getFullName());
        }
        dto.setContent(s.getContent());
        dto.setGrade(s.getGrade());
        dto.setFeedback(s.getFeedback());
        dto.setSubmittedAt(s.getSubmittedAt());
        return dto;
    }
}
