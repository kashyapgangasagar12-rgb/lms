package com.learningplatform.service;

import com.learningplatform.dto.ReviewDto;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.Review;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.ReviewRepository;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewDto submitReview(ReviewDto dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new SecurityException("User not authenticated");

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        User user = userRepository.findById(userId).orElseThrow();

        // Check if user is enrolled (only enrolled students can rate)
        boolean isEnrolled = course.getEnrolledStudents().stream().anyMatch(s -> s.getId().equals(userId));
        if (!isEnrolled && !user.getRole().name().equals("ADMIN")) {
            throw new SecurityException("You must be enrolled in this course to leave a review");
        }

        // Check for existing review (one review per user per course)
        Review review = reviewRepository.findByCourseIdAndUserId(dto.getCourseId(), userId)
                .orElse(new Review());

        review.setUser(user);
        review.setCourse(course);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return mapToDto(saved);
    }

    public List<ReviewDto> getReviewsForCourse(Long courseId) {
        return reviewRepository.findByCourseId(courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public double getAverageRating(Long courseId) {
        List<Review> reviews = reviewRepository.findByCourseId(courseId);
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
    }

    private ReviewDto mapToDto(Review r) {
        return ReviewDto.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .userName(r.getUser().getFullName())
                .courseId(r.getCourse().getId())
                .rating(r.getRating())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
