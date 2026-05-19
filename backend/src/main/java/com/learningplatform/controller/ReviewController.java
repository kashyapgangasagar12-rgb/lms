package com.learningplatform.controller;

import com.learningplatform.dto.ReviewDto;
import com.learningplatform.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ReviewDto> submitReview(@RequestBody ReviewDto dto) {
        return ResponseEntity.ok(reviewService.submitReview(dto));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ReviewDto>> getReviews(@PathVariable Long courseId) {
        return ResponseEntity.ok(reviewService.getReviewsForCourse(courseId));
    }
}
