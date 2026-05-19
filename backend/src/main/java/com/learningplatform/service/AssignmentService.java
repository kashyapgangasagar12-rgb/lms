package com.learningplatform.service;

import com.learningplatform.dto.AssignmentDto;
import com.learningplatform.dto.TeacherAnalyticsDto;
import com.learningplatform.entity.Assignment;
import com.learningplatform.entity.Course;
import com.learningplatform.repository.AssignmentRepository;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.repository.SubmissionRepository;
import com.learningplatform.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public AssignmentDto createAssignment(AssignmentDto dto) {
        Long courseId = dto.getCourseId();
        if (courseId == null) {
            throw new IllegalArgumentException("Course ID cannot be null");
        }
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Enforce ownership: Only the course instructor (or ADMIN) can create assignments
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId != null && course.getInstructor() != null
                && !course.getInstructor().getId().equals(currentUserId)) {
            var currentUser = userRepository.findById(currentUserId).orElseThrow();
            if (!currentUser.getRole().name().equals("ADMIN")) {
                throw new SecurityException("You are not authorized to create assignments for this course");
            }
        }

        List<com.learningplatform.entity.User> students = java.util.Collections.emptyList();
        List<Long> studentIds = dto.getStudentIds();
        if (studentIds != null && !studentIds.isEmpty()) {
            students = userRepository.findAllById(studentIds);
        }

        Assignment assignment = Assignment.builder()
                .course(course)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .dueDate(dto.getDueDate())
                .maxMarks(dto.getMaxMarks())
                .assignedStudents(students)
                .build();

        @SuppressWarnings("null")
        Assignment saved = assignmentRepository.save(assignment);
        return mapToDto(saved);
    }

    public List<AssignmentDto> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AssignmentDto> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AssignmentDto> getAssignmentsForStudent(Long studentId) {
        return assignmentRepository.findAll().stream()
                .filter(a -> {
                    Course course = a.getCourse();
                    if (course == null)
                        return false;
                    return a.getAssignedStudents().isEmpty() ||
                            a.getAssignedStudents().stream().anyMatch(s -> s.getId().equals(studentId));
                })
                .map(a -> {
                    AssignmentDto dto = mapToDto(a);
                    submissionRepository.findByAssignmentIdAndStudentId(a.getId(), studentId)
                            .ifPresent(s -> {
                                dto.setGrade(s.getGrade());
                                dto.setFeedback(s.getFeedback());
                            });
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public TeacherAnalyticsDto getTeacherAnalytics(Long instructorId) {
        if (instructorId == null) return new TeacherAnalyticsDto();

        List<Course> instructorCourses = courseRepository.findAll().stream()
                .filter(c -> c.getInstructor() != null && c.getInstructor().getId().equals(instructorId))
                .collect(Collectors.toList());

        List<Long> courseIds = instructorCourses.stream().map(Course::getId).collect(Collectors.toList());
        if (courseIds.isEmpty()) return new TeacherAnalyticsDto();

        List<Assignment> instructorAssignments = assignmentRepository.findAll().stream()
                .filter(a -> a.getCourse() != null && courseIds.contains(a.getCourse().getId()))
                .collect(Collectors.toList());

        long totalAssignments = instructorAssignments.size();

        List<com.learningplatform.entity.Submission> allSubmissions = submissionRepository.findAll();

        long totalSubmissions = allSubmissions.stream()
                .filter(s -> s.getAssignment() != null && s.getAssignment().getCourse() != null && 
                            courseIds.contains(s.getAssignment().getCourse().getId()))
                .count();

        long pendingGrades = allSubmissions.stream()
                .filter(s -> s.getAssignment() != null && s.getAssignment().getCourse() != null && 
                            courseIds.contains(s.getAssignment().getCourse().getId()))
                .filter(s -> s.getGrade() == null)
                .count();

        double averageScore = allSubmissions.stream()
                .filter(s -> s.getAssignment() != null && s.getAssignment().getCourse() != null && 
                            courseIds.contains(s.getAssignment().getCourse().getId()))
                .filter(s -> s.getGrade() != null)
                .mapToDouble(s -> parseGrade(s.getGrade()))
                .average()
                .orElse(0.0);

        long totalStudents = instructorCourses.stream()
                .flatMap(c -> c.getEnrolledStudents().stream())
                .map(com.learningplatform.entity.User::getId)
                .distinct()
                .count();

        List<TeacherAnalyticsDto.AssignmentTrend> trends = instructorAssignments.stream()
                .map(a -> {
                    double avg = allSubmissions.stream()
                            .filter(s -> s.getAssignment() != null && s.getAssignment().getId().equals(a.getId()))
                            .filter(s -> s.getGrade() != null)
                            .mapToDouble(s -> parseGrade(s.getGrade()))
                            .average()
                            .orElse(0.0);
                    return TeacherAnalyticsDto.AssignmentTrend.builder()
                            .title(a.getTitle())
                            .averageScore(avg)
                            .build();
                })
                .collect(Collectors.toList());

        return TeacherAnalyticsDto.builder()
                .totalAssignments(totalAssignments)
                .totalSubmissions(totalSubmissions)
                .pendingGrades(pendingGrades)
                .averageScore(averageScore)
                .totalStudents(totalStudents)
                .trends(trends)
                .build();
    }

    private double parseGrade(String grade) {
        if (grade == null) return 0.0;
        try {
            return Double.parseDouble(grade.replaceAll("[^\\d.]", ""));
        } catch (NumberFormatException e) {
            String g = grade.trim().toUpperCase();
            if (g.startsWith("A")) return 95.0;
            if (g.startsWith("B")) return 85.0;
            if (g.startsWith("C")) return 75.0;
            if (g.startsWith("D")) return 65.0;
            if (g.startsWith("F")) return 50.0;
            return 0.0;
        }
    }

    private AssignmentDto mapToDto(Assignment a) {
        AssignmentDto dto = new AssignmentDto();
        dto.setId(a.getId());
        Course course = a.getCourse();
        if (course != null) {
            dto.setCourseId(course.getId());
        }
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setDueDate(a.getDueDate());
        dto.setMaxMarks(a.getMaxMarks());
        if (a.getAssignedStudents() != null) {
            dto.setStudentIds(a.getAssignedStudents().stream()
                    .map(com.learningplatform.entity.User::getId)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
