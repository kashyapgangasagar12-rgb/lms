package com.learningplatform.controller;

import com.learningplatform.dto.AssignmentDto;
import com.learningplatform.dto.TeacherAnalyticsDto;
import com.learningplatform.service.AssignmentService;
import com.learningplatform.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<AssignmentDto> create(@RequestBody AssignmentDto dto) {
        return ResponseEntity.ok(assignmentService.createAssignment(dto));
    }

    @GetMapping
    public ResponseEntity<List<AssignmentDto>> getAll() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<AssignmentDto>> getMy(@RequestParam Long studentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsForStudent(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AssignmentDto>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByCourse(courseId));
    }

    @GetMapping("/teacher/analytics")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<TeacherAnalyticsDto> getTeacherAnalytics() {
        Long instructorId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(assignmentService.getTeacherAnalytics(instructorId));
    }
}
