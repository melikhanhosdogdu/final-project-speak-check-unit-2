package com.mike.speak_check.security;

import com.mike.speak_check.dto.response.UserResponseDTO;
import com.mike.speak_check.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService  jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);
        try {
            String userIdStr = jwtService.parse(token).getSubject();
            UUID userId = UUID.fromString(userIdStr);

            UserResponseDTO user = userService.getUserById(userId);

            var auth = new UsernamePasswordAuthenticationToken(user.getId(), null, List.of());

            SecurityContextHolder.getContext().setAuthentication(auth);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;

        }

        filterChain.doFilter(request, response);
    }
}
