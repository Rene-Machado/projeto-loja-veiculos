package com.example.vehicles.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.vehicles.model.AppUser;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmail(String email);
}
