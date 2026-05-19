package com.learningplatform.controller;

import com.learningplatform.entity.Course;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EntityManager entityManager;

    @GetMapping("/users")
    public ResponseEntity<List<UserSummary>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserSummary> summaries = users.stream()
                .filter(u -> !u.getRole().name().equals("ADMIN"))
                .map(u -> new UserSummary(u.getId(), u.getFullName(), u.getEmail(), u.getRole().name()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(summaries);
    }

    @DeleteMapping("/users/{id}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().name().equals("ADMIN")) {
            return ResponseEntity.badRequest().build();
        }

        // 1. Remove student_courses enrollments for this user
        entityManager.createNativeQuery("DELETE FROM student_courses WHERE student_id = :uid")
                .setParameter("uid", id)
                .executeUpdate();

        // 2. Delete all courses this user owns as instructor
        //    (JPA cascade ALL on lessons/assignments/reviews handles children automatically)
        List<Course> ownedCourses = courseRepository.findByInstructor(user);
        for (Course course : ownedCourses) {
            // Remove enrolled students from join table first to avoid FK issue
            entityManager.createNativeQuery("DELETE FROM student_courses WHERE course_id = :cid")
                    .setParameter("cid", course.getId())
                    .executeUpdate();
            entityManager.flush();
            courseRepository.delete(course);
        }

        // 3. Clean up legacy tables that JPA no longer knows about
        String[] legacyTables = { "study_path_steps", "study_paths", "quiz_attempts" };
        for (String table : legacyTables) {
            try {
                Integer count = ((Number) entityManager.createNativeQuery(
                        "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = :tname")
                        .setParameter("tname", table)
                        .getSingleResult()).intValue();
                if (count > 0) {
                    entityManager.createNativeQuery("DELETE FROM " + table + " WHERE user_id = :uid")
                            .setParameter("uid", id)
                            .executeUpdate();
                }
            } catch (Exception e) {
                // Ignore legacy cleanup errors
            }
        }

        // 4. Finally delete the user
        userRepository.delete(user);
        return ResponseEntity.ok().build();
    }

    public record UserSummary(Long id, String fullName, String email, String role) {
    }
}

