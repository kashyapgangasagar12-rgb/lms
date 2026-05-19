package com.learningplatform.repository;

import com.learningplatform.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCourseId(Long courseId);
    Optional<Review> findByCourseIdAndUserId(Long courseId, Long userId);
    long countByCourseId(Long courseId);
}
