package com.example.vehicles.controller;

import com.example.vehicles.model.AppUser;
import com.example.vehicles.model.Role;
import com.example.vehicles.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AppUserRepository repo;

    public AdminUserController(AppUserRepository repo) {
        this.repo = repo;
    }

    // Endpoint para promover usuário a ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/promote")
    public ResponseEntity<AppUser> promote(@PathVariable Long id) {
        return repo.findById(id)
                .map(user -> {
                    user.setRole(Role.ADMIN);
                    repo.save(user);
                    return ResponseEntity.ok(user);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
