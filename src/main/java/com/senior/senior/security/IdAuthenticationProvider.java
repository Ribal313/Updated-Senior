package com.senior.senior.security;

import com.senior.senior.entity.Users;
import com.senior.senior.service.UsersService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

public class IdAuthenticationProvider implements AuthenticationProvider {

    private final UsersService usersService;
    private final PasswordEncoder passwordEncoder;

    public IdAuthenticationProvider(UsersService usersService, PasswordEncoder passwordEncoder) {
        this.usersService = usersService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Long id;
        try {
            id = Long.parseLong(authentication.getName());
        } catch (NumberFormatException e) {
            throw new BadCredentialsException("Invalid ID format.");
        }

        String password = authentication.getCredentials().toString();
        Users user = usersService.loadUserById(id);

        if (!passwordEncoder.matches(password, user.getUserPass())) {
            throw new BadCredentialsException("Incorrect password.");
        }

        return new UsernamePasswordAuthenticationToken(
                id.toString(),
                password,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
