package com.learningplatform.repository;

import com.learningplatform.entity.Course;
import com.learningplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA repository for Course entity.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    /** Find all courses where the given user is the instructor. */
    List<Course> findByInstructor(User instructor);
}
