package com.learningplatform.service;

import com.learningplatform.dto.CourseDto;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.Review;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.LessonRepository;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.repository.ReviewRepository;
import com.learningplatform.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for Course management.
 */
@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final ReviewRepository reviewRepository;

    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public Course getCourseById(Long id) {
        if (id == null) throw new IllegalArgumentException("ID must not be null");
        return courseRepository.findById(id).orElseThrow();
    }

    public CourseDto getCourseDtoById(Long id) {
        return convertToDto(getCourseById(id));
    }

    public CourseDto createCourse(CourseDto dto) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        var instructorUser = (currentUserId != null)
                ? userRepository.findById(currentUserId).orElse(null)
                : null;

        Course course = Course.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .imageUrl(dto.getImageUrl())
                .instructor(instructorUser)
                .instructorName(dto.getInstructorName())
                .learningObjectives(dto.getLearningObjectives())
                .rating(dto.getRating() != null ? dto.getRating() : 0.0)
                .category(dto.getCategory())
                .build();
        @SuppressWarnings("null")
        Course saved = courseRepository.save(course);
        return convertToDto(saved);
    }

    public CourseDto updateCourse(Long id, CourseDto dto) {
        Course course = getCourseById(id);

        // Only the instructor who created the course (or ADMIN) can update it
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId != null && course.getInstructor() != null
                && !course.getInstructor().getId().equals(currentUserId)) {
            // Check if admin
            var currentUser = userRepository.findById(currentUserId).orElseThrow();
            if (!currentUser.getRole().name().equals("ADMIN")) {
                throw new SecurityException("You are not authorized to update this course");
            }
        }

        course.setName(dto.getName());
        course.setDescription(dto.getDescription());
        course.setImageUrl(dto.getImageUrl());
        course.setInstructorName(dto.getInstructorName());
        course.setLearningObjectives(dto.getLearningObjectives());
        course.setCategory(dto.getCategory());
        @SuppressWarnings("null")
        Course saved = courseRepository.save(course);
        return convertToDto(saved);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = getCourseById(id);

        // Only the instructor who created the course (or ADMIN) can delete it
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId != null && course.getInstructor() != null
                && !course.getInstructor().getId().equals(currentUserId)) {
            var currentUser = userRepository.findById(currentUserId).orElseThrow();
            if (!currentUser.getRole().name().equals("ADMIN")) {
                throw new SecurityException("You are not authorized to delete this course");
            }
        }

        // Decouple students from this course (ManyToMany handling)
        for (User student : new java.util.ArrayList<>(course.getEnrolledStudents())) {
            student.getEnrolledCourses().remove(course);
            userRepository.save(student);
        }
        course.getEnrolledStudents().clear();

        courseRepository.delete(course);
    }

    @Transactional
    public void enrollStudent(Long userId, Long courseId) {
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        var course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!user.getEnrolledCourses().contains(course)) {
            user.getEnrolledCourses().add(course);
            userRepository.save(user);
        }
    }

    public List<CourseDto> getEnrolledCourses(Long userId) {
        var user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getEnrolledCourses().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private CourseDto convertToDto(Course course) {
        List<Review> reviews = reviewRepository.findByCourseId(course.getId());
        double avgRating = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        long reviewCount = reviews.size();
        int lessonCount = lessonRepository.findByCourseIdOrderByOrderIndexAsc(course.getId()).size();

        return CourseDto.builder()
                .id(course.getId())
                .name(course.getName())
                .description(course.getDescription())
                .imageUrl(course.getImageUrl())
                .instructorId(course.getInstructor() != null ? course.getInstructor().getId() : null)
                .instructorName(course.getInstructorName())
                .learningObjectives(course.getLearningObjectives())
                .rating(avgRating > 0 ? avgRating : (course.getRating() != null ? course.getRating() : 0.0))
                .reviewCount(reviewCount)
                .category(course.getCategory())
                .lessonCount(lessonCount)
                .build();
    }
}
