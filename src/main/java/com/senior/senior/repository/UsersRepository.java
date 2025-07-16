package com.senior.senior.repository;

import com.senior.senior.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByIdAndUserPass(Long id,String userPass);
    boolean existsByEmail(String email);
    Optional<Object> findByEmail(String email);
}
