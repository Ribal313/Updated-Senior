package com.senior.senior.controller;

import com.senior.senior.dto.LoginRequest;
import com.senior.senior.dto.UsersDTO;
import com.senior.senior.entity.Users;
import com.senior.senior.exception.CustomException;
import com.senior.senior.mapper.UsersMapper;
import com.senior.senior.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    private final UsersMapper userMapper = UsersMapper.INSTANCE;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UsersDTO usersDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        try {
            usersService.createUser(usersDTO); // does NOT save user
            return ResponseEntity.ok("Verification email sent. Please check your inbox.");
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam("token") String token) {
        String result = usersService.verifyUserByToken(token);
        if (result.equals("success")) {
            return ResponseEntity.ok("Email verified successfully");
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

@PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            String jwt = usersService.loginAndGenerateToken(loginRequest);
            Users user = usersService.loadUserById(loginRequest.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", jwt);
            response.put("id", user.getId());

            return ResponseEntity.ok(response);
        } catch (CustomException e) {
            Map<String, String> error = Map.of("message", "Invalid credentials: " + e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UsersDTO> getUserById(@PathVariable Long id) {
        Optional<Users> user = usersService.getUserById(id);
        return user.map(value -> ResponseEntity.ok(userMapper.toDto(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Get all users
    @GetMapping("/all")
    public ResponseEntity<List<UsersDTO>> getAllUsers() {
        List<UsersDTO> users = usersService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ✅ Update user
    @PutMapping("/{id}")
    public ResponseEntity<UsersDTO> updateUser(@PathVariable Long id, @RequestBody UsersDTO usersDTO) {
        Users updatedUser = usersService.updateUser(id, usersDTO);
        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }

    // ✅ Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        usersService.deleteUserAndReturn(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
