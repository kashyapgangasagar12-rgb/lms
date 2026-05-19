package com.learningplatform.controller;

import com.learningplatform.dto.SubmissionDto;
import com.learningplatform.dto.AnalyticsDto;
import com.learningplatform.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmissionDto> submit(@RequestBody SubmissionDto dto) {
        return ResponseEntity.ok(submissionService.submitAssignment(dto));
    }

    @PostMapping("/{id}/grade")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<SubmissionDto> grade(@PathVariable Long id, @RequestParam String grade,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(submissionService.gradeSubmission(id, grade, feedback));
    }

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<SubmissionDto>> getByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<SubmissionDto>> getMySubmissions(@RequestParam Long studentId) {
        return ResponseEntity.ok(submissionService.getMySubmissions(studentId));
    }

    @GetMapping("/analytics/student/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<AnalyticsDto> getStudentAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getStudentAnalytics(id));
    }
}
