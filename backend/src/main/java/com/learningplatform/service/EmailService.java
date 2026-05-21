package com.learningplatform.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Sends transactional emails via Brevo (Sendinblue) SMTP.
 * All sends are async to avoid blocking HTTP responses.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    /**
     * Sends a password reset email containing a clickable reset link.
     */
    @Async
    public void sendPasswordResetEmail(String toEmail, String otp) {
        String subject = "Reset Your LMS Password";
        String htmlBody = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px;
                            background: #f9f9f9; border-radius: 8px;">
                    <h2 style="color: #4F46E5;">LMS Platform – Password Reset</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password. Use the verification code below to set a new password:</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px;
                                     color: #4F46E5; background: #EEF2FF; padding: 16px 32px;
                                     border-radius: 8px; display: inline-block;">
                            %s
                        </span>
                    </div>
                    <p style="color: #6B7280; font-size: 13px;">
                        This code will expire in <strong>1 hour</strong>.<br>
                        If you did not request a password reset, you can safely ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
                    <p style="color: #9CA3AF; font-size: 12px;">LMS Platform · Powered by Brevo</p>
                </div>
                """.formatted(otp);

        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    /**
     * Sends a 6-digit OTP for email verification.
     */
    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        String subject = "Your LMS Verification Code";
        String htmlBody = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 32px;
                            background: #f9f9f9; border-radius: 8px;">
                    <h2 style="color: #4F46E5;">Email Verification</h2>
                    <p>Hello,</p>
                    <p>Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px;
                                     color: #4F46E5; background: #EEF2FF; padding: 16px 32px;
                                     border-radius: 8px; display: inline-block;">
                            %s
                        </span>
                    </div>
                    <p style="color: #6B7280; font-size: 13px;">
                        If you didn't request this, please ignore this email.
                    </p>
                    <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;">
                    <p style="color: #9CA3AF; font-size: 12px;">LMS Platform · Powered by Brevo</p>
                </div>
                """.formatted(otp);

        sendHtmlEmail(toEmail, subject, htmlBody);
    }

    // ─── internal helper ────────────────────────────────────────────────────────

    private void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = isHtml
            mailSender.send(message);
            log.info("Email sent to {} | subject: {}", to, subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
