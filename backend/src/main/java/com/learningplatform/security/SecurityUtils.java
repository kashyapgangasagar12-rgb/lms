package com.learningplatform.security;

import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utility for Spring Security context.
 */
public class SecurityUtils {
    public static Long getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            return principal.getId();
        }
        return null;
    }
}
