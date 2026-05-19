package com.learningplatform.dto;

import com.learningplatform.entity.Role;
import lombok.*;

/**
 * Response DTO for auth (login/register) with JWT and user info.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private Role role;
}
