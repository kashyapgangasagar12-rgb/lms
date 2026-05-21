package com.learningplatform.service;

import com.learningplatform.dto.AuthResponse;
import com.learningplatform.dto.LoginRequest;
import com.learningplatform.dto.RegisterRequest;
import com.learningplatform.entity.Role;
import com.learningplatform.entity.User;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.security.JwtTokenProvider;
import com.learningplatform.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Handles login, registration, and JWT token generation.
 * Passwords are encrypted with BCrypt.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Value("${app.cors.allowed-origins:http://localhost:3000}")
    private String allowedOrigins;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .isVerified(false)
                .otp(otp)
                .otpExpiry(java.time.LocalDateTime.now().plusMinutes(10))
                .build();
        user = userRepository.save(user);
        
        emailService.sendOtpEmail(user.getEmail(), otp);
        log.info("User registered. OTP sent to: {}", user.getEmail());
        
        return AuthResponse.builder()
                .email(user.getEmail())
                .build(); // token is null until verified
    }

    @Transactional
    public AuthResponse verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            throw new RuntimeException("User already verified");
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        log.info("User verified successfully: {}", user.getEmail());
        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId()).orElseThrow();
        
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email using the OTP sent to you");
        }
        log.info("User logged in successfully: {}", principal.getEmail());
        String token = tokenProvider.generateToken(authentication);
        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .id(principal.getId())
                .email(principal.getEmail())
                .fullName(principal.getFullName())
                .role(principal.getRole())
                .build();
    }

    public void processForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No account found with email: " + email));

        String otp = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetToken(otp);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), otp);
        log.info("Password reset OTP sent to: {}", user.getEmail());
    }

    @Transactional
    public void resetPassword(String email, String token, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No account found with email: " + email));

        if (user.getResetToken() == null || !user.getResetToken().equals(token)) {
            throw new IllegalArgumentException("Invalid reset verification code");
        }

        if (user.getResetTokenExpiry().isBefore(java.time.LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset verification code has expired. Please request a new code.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        log.info("Password updated successfully for: {}", user.getEmail());
    }
}
