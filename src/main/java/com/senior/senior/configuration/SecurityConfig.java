package com.senior.senior.configuration;

import com.senior.senior.repository.SolarPanelRepository;
import com.senior.senior.repository.UsersRepository;
import com.senior.senior.repository.VerificationTokenRepository;
import com.senior.senior.security.CustomIdAuthenticationFilter;
import com.senior.senior.security.IdAuthenticationProvider;
import com.senior.senior.service.EmailService;
import com.senior.senior.service.UsersService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsersRepository usersRepository;
    private final SolarPanelRepository solarPanelRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public SecurityConfig(UsersRepository usersRepository,
                          SolarPanelRepository solarPanelRepository,
                          VerificationTokenRepository verificationTokenRepository,
                          EmailService emailService,
                          JwtUtil jwtUtil) {
        this.usersRepository = usersRepository;
        this.solarPanelRepository = solarPanelRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UsersService usersService(
            UsersRepository usersRepository,
            SolarPanelRepository solarPanelRepository,
            PasswordEncoder passwordEncoder,
            VerificationTokenRepository verificationTokenRepository,
            EmailService emailService,
            JwtUtil jwtUtil) {
        return new UsersService(usersRepository, solarPanelRepository, passwordEncoder,
                verificationTokenRepository, emailService, jwtUtil);
    }

    @Bean
    public IdAuthenticationProvider idAuthenticationProvider(UsersService usersService, PasswordEncoder passwordEncoder) {
        return new IdAuthenticationProvider(usersService, passwordEncoder);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   AuthenticationConfiguration authConfig,
                                                   IdAuthenticationProvider idAuthenticationProvider) throws Exception {
        AuthenticationManager authManager = authConfig.getAuthenticationManager();

        CustomIdAuthenticationFilter customFilter = new CustomIdAuthenticationFilter();
        customFilter.setAuthenticationManager(authManager);
        customFilter.setFilterProcessesUrl("/custom-login");

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/api/users/all").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(idAuthenticationProvider)
                .addFilterAt(customFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/custom-login")
                        .defaultSuccessUrl("/dashboard", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedOrigins(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    @Bean
    RestTemplate restTemplate(){
        return new RestTemplate();
    }
}


