package com.learningplatform.controller;

import com.learningplatform.dto.LessonDto;
import com.learningplatform.dto.ProgressDto;
import com.learningplatform.security.UserPrincipal;
import com.learningplatform.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LessonDto>> getLessonsForCourse(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long courseId) {
        Long userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(lessonService.getLessonsForCourse(userId, courseId));
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> completeLesson(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        if (principal != null) {
            lessonService.completeLesson(principal.getId(), id);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonDto> getLesson(@PathVariable Long id) {
        return ResponseEntity.ok(lessonService.getLessonById(id));
    }

    @GetMapping("/progress")
    public ResponseEntity<ProgressDto> getProgress(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null)
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(lessonService.getStudentProgress(principal.getId()));
    }

    @GetMapping("/progress/{courseId}")
    public ResponseEntity<ProgressDto> getCourseProgress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long courseId) {
        if (principal == null)
            return ResponseEntity.badRequest().build();
        return ResponseEntity.ok(lessonService.getCourseProgress(principal.getId(), courseId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<LessonDto> createLesson(@RequestBody LessonDto dto) {
        return ResponseEntity.ok(lessonService.createLesson(dto));
    }
}

