package com.learningplatform.controller;

import com.learningplatform.dto.AuthResponse;
import com.learningplatform.dto.LoginRequest;
import com.learningplatform.dto.RegisterRequest;
import com.learningplatform.dto.ForgotPasswordRequest;
import com.learningplatform.dto.ResetPasswordRequest;
import com.learningplatform.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST API for login and registration. Public endpoints.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Received login request for: {}", request.getEmail());
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Received registration request for: {} (Role: {})", request.getEmail(), request.getRole());
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Processing forgot password for: {}", request.getEmail());
        authService.processForgotPassword(request.getEmail());
        return ResponseEntity.ok(Map.of("message", "Password reset link has been sent to your email (simulated in console)"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Processing reset password for token: {}", request.getToken());
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password has been successfully reset"));
    }
}
