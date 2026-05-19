package com.learningplatform.controller;
import com.learningplatform.entity.User;
import com.learningplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Teacher dashboard: class analytics, student overview.
 */
@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final UserRepository userRepository;

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<List<UserSummary>> listStudents() {
        List<User> students = userRepository.findAllByRole(com.learningplatform.entity.Role.STUDENT);
        List<UserSummary> list = students.stream()
                .map(s -> new UserSummary(s.getId(), s.getFullName(), s.getEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    public record UserSummary(Long id, String fullName, String email) {
    }
}
