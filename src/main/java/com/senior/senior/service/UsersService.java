package com.senior.senior.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.senior.configuration.JwtUtil;
import com.senior.senior.dto.LoginRequest;
import com.senior.senior.dto.UsersDTO;
import com.senior.senior.entity.SolarPanel;
import com.senior.senior.entity.Users;
import com.senior.senior.entity.VerificationToken;
import com.senior.senior.exception.CustomException;
import com.senior.senior.mapper.UsersMapper;
import com.senior.senior.repository.SolarPanelRepository;
import com.senior.senior.repository.UsersRepository;
import com.senior.senior.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UsersService {

    private final UsersRepository userRepository;
    private final SolarPanelRepository solarPanelRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final UsersMapper userMapper = UsersMapper.INSTANCE;
    private final JwtUtil jwtUtil;

    @Autowired
    public UsersService(UsersRepository userRepository,
                        SolarPanelRepository solarPanelRepository,
                        PasswordEncoder passwordEncoder,
                        VerificationTokenRepository verificationTokenRepository,
                        EmailService emailService,
                        JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.solarPanelRepository = solarPanelRepository;
        this.passwordEncoder = passwordEncoder;
        this.verificationTokenRepository = verificationTokenRepository;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    // ✅ Create new user and send email verification
    public void createUser(UsersDTO usersDTO) {
        if (usersDTO.getId() == null || usersDTO.getId() == 0)
            throw new CustomException("User ID must be a non-zero value.");

        if (userRepository.existsById(usersDTO.getId()))
            throw new CustomException("User with ID " + usersDTO.getId() + " already exists.");

        if (userRepository.existsByEmail(usersDTO.getEmail()))
            throw new CustomException("User with email " + usersDTO.getEmail() + " already exists.");

        // Encode password before storing in token
        usersDTO.setUserPass(passwordEncoder.encode(usersDTO.getUserPass()));

        // Convert UsersDTO to JSON
        String userJson;
        try {
            ObjectMapper mapper = new ObjectMapper();
            userJson = mapper.writeValueAsString(usersDTO);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize user", e);
        }

        // Save token with serialized user
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(token, userJson, LocalDateTime.now().plusDays(1));
        verificationTokenRepository.save(verificationToken);

        String verifyLink = "http://localhost:8081/api/users/verify?token=" + token;
        emailService.sendVerificationEmail(usersDTO.getEmail(), verifyLink);
    }

    public String verifyUserByToken(String token) {
        VerificationToken vToken = verificationTokenRepository.findByToken(token);
        if (vToken == null) return "Invalid verification token";
        if (vToken.getExpiryDate().isBefore(LocalDateTime.now())) return "Token expired";

        // Deserialize JSON back to UsersDTO
        UsersDTO usersDTO;
        try {
            ObjectMapper mapper = new ObjectMapper();
            usersDTO = mapper.readValue(vToken.getUserJson(), UsersDTO.class);
        } catch (JsonProcessingException e) {
            return "Failed to parse user data";
        }

        if (userRepository.existsByEmail(usersDTO.getEmail())) return "Email already registered";

        Users user = userMapper.toEntity(usersDTO);
        user.setEmailVerified(true);

        Optional<SolarPanel> latestSolar = solarPanelRepository.findTopByOrderByIdDesc();
        latestSolar.ifPresent(user::setSolarPanel);

        userRepository.save(user);
        verificationTokenRepository.delete(vToken);

        return "Email verified and user created successfully.";
    }

    // ✅ Login and generate JWT if verified
    public String loginAndGenerateToken(LoginRequest loginRequest) {
        Users user = userRepository.findById(loginRequest.getId())
                .orElseThrow(() -> new CustomException("User not found"));

        if (!checkPassword(user, loginRequest.getPassword())) {
            throw new CustomException("Invalid user or password");
        }

        if (!user.isEmailVerified()) {
            throw new CustomException("Please verify your email before logging in.");
        }

        return jwtUtil.generateToken(user.getId().toString(), user.getRole());
    }

    // ✅ Check password
    public boolean checkPassword(Users user, String rawPassword) {
        if (user == null || rawPassword == null || rawPassword.isEmpty()) {
            throw new CustomException("Invalid user or password");
        }
        return passwordEncoder.matches(rawPassword, user.getUserPass());
    }

    // ✅ Get all users
    public List<UsersDTO> getAllUsers() {
        List<Users> users = userRepository.findAll();
        return userMapper.toDTOList(users);
    }

    // ✅ Get user by ID
    public Optional<Users> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // ✅ Get user by ID and password
    public Optional<Users> getUserByIdAndUserPass(Long id, String userPass) {
        return userRepository.findByIdAndUserPass(id, userPass);
    }

    // ✅ Update password
    public Users updateUser(Long id, UsersDTO usersDTO) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found"));
        user.setUserPass(passwordEncoder.encode(usersDTO.getUserPass()));
        return userRepository.save(user);
    }

    // ✅ Delete user and return DTO
    public UsersDTO deleteUserAndReturn(Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found"));
        userRepository.delete(user);
        return userMapper.toDto(user);
    }

    // ✅ Load user
    public Users loadUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new CustomException("User not found with ID: " + id));
    }
}
