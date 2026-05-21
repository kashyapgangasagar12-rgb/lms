package com.learningplatform.service;

import com.learningplatform.dto.LessonDto;
import com.learningplatform.dto.ProgressDto;
import com.learningplatform.entity.Lesson;
import com.learningplatform.entity.LessonCompletion;
import com.learningplatform.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing lessons within topics.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;

    @Transactional
    public LessonDto createLesson(LessonDto dto) {
        Long courseIdBoxed = dto.getCourseId();
        if (courseIdBoxed == null) {
            throw new IllegalArgumentException("Course ID must not be null");
        }
        var course = courseRepository.findById(courseIdBoxed)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Lesson lesson = Lesson.builder()
                .course(course)
                .title(dto.getTitle())
                .content(dto.getContent())
                .orderIndex(dto.getOrderIndex() != null ? dto.getOrderIndex() : 1)
                .videoUrl(dto.getVideoUrl())
                .attachmentsUrl(dto.getAttachmentsUrl())
                .scheduledDate(dto.getScheduledDate())
                .build();

        @SuppressWarnings("null")
        Lesson saved = lessonRepository.save(lesson);
        return toDto(saved);
    }

    @Transactional
    public void completeLesson(Long userId, Long lessonId) {
        if (lessonCompletionRepository.findByUserIdAndLessonId(userId, lessonId).isPresent()) {
            return;
        }
        var user = userRepository.findById(userId).orElseThrow();
        var lesson = lessonRepository.findById(lessonId).orElseThrow();

        LessonCompletion completion = LessonCompletion.builder()
                .user(user)
                .lesson(lesson)
                .build();
        lessonCompletionRepository.save(completion);
    }

    public List<LessonDto> getLessonsForCourse(Long userId, Long courseId) {
        List<LessonDto> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        if (userId != null) {
            Set<Long> completedIds = lessonCompletionRepository.findByUserId(userId).stream()
                    .map(c -> c.getLesson().getId())
                    .collect(Collectors.toSet());
            lessons.forEach(l -> l.setCompleted(completedIds.contains(l.getId())));
        }
        return lessons;
    }

    public ProgressDto getStudentProgress(Long userId) {
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        long completed = lessonCompletionRepository.findByUserId(userId).size();
        
        // Count lessons only from enrolled courses
        long totalEnrolledLessons = user.getEnrolledCourses().stream()
                .mapToLong(c -> lessonRepository.findByCourseIdOrderByOrderIndexAsc(c.getId()).size())
                .sum();

        long submitted = submissionRepository.findAll().stream()
                .filter(s -> s.getStudent().getId().equals(userId))
                .count();
        long totalAssigned = assignmentRepository.count(); // Could also be filtered if needed

        return ProgressDto.builder()
                .completedLessons(completed)
                .totalLessons(totalEnrolledLessons > 0 ? totalEnrolledLessons : 0) 
                .submittedAssignments(submitted)
                .totalAssignments(totalAssigned)
                .build();
    }

    /**
     * Returns per-course progress: how many lessons a user completed in a given course.
     */
    public ProgressDto getCourseProgress(Long userId, Long courseId) {
        long completed = lessonCompletionRepository.countByUserIdAndLessonCourseId(userId, courseId);
        long total = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId).size();
        return ProgressDto.builder()
                .completedLessons(completed)
                .totalLessons(total)
                .build();
    }

    public LessonDto getLessonById(Long id) {
        if (id == null)
            throw new IllegalArgumentException("ID must not be null");
        Lesson l = lessonRepository.findById(id).orElseThrow();
        return toDto(l);
    }

    private LessonDto toDto(Lesson l) {
        return LessonDto.builder()
                .id(l.getId())
                .courseId(l.getCourse().getId())
                .courseName(l.getCourse().getName())
                .title(l.getTitle())
                .content(l.getContent())
                .orderIndex(l.getOrderIndex())
                .videoUrl(l.getVideoUrl())
                .attachmentsUrl(l.getAttachmentsUrl())
                .scheduledDate(l.getScheduledDate())
                .build();
    }
}
