package com.learningplatform.config;

import com.learningplatform.entity.*;
import com.learningplatform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Seeds sample topics, lessons, and demo users for development.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting data seeding...");

        User admin = User.builder().email("admin@test.com").password(passwordEncoder.encode("password"))
                .fullName("Admin").role(Role.ADMIN).build();

        if (userRepository.count() == 0) {
            userRepository.saveAll(List.of(admin));
            log.info("Sample users seeded.");
        }

    }
}