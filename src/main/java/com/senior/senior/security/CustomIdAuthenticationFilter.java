    package com.senior.senior.security;

    import jakarta.servlet.http.HttpServletRequest;
    import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

    public class CustomIdAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

        @Override
        protected String obtainUsername(HttpServletRequest request) {
            return request.getParameter("id");
        }

        @Override
        protected String obtainPassword(HttpServletRequest request) {
            return request.getParameter("password");
        }
    }
