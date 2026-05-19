package com.learningplatform.repository;

import com.learningplatform.entity.LessonCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, Long> {
    List<LessonCompletion> findByUserId(Long userId);

    Optional<LessonCompletion> findByUserIdAndLessonId(Long userId, Long lessonId);

    long countByUserIdAndLessonCourseId(Long userId, Long courseId);
}
