package com.senior.senior.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    @Lob // Stores the UsersDTO as JSON
    private String userJson;

    private LocalDateTime expiryDate;

    public VerificationToken() {}

    public VerificationToken(String token, String userJson, LocalDateTime expiryDate) {
        this.token = token;
        this.userJson = userJson;
        this.expiryDate = expiryDate;
    }
}
