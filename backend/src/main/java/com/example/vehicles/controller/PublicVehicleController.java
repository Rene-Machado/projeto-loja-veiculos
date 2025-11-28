package com.example.vehicles.controller;

import com.example.vehicles.entity.Vehicle;
import com.example.vehicles.repository.VehicleRepository;
import com.example.vehicles.service.VehicleService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vehicles")
public class PublicVehicleController {

    private final VehicleService service;
    private final VehicleRepository repo;

    public PublicVehicleController(VehicleService service, VehicleRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<Page<Vehicle>> list(@RequestParam(required = false) String q, Pageable pageable) {
        Page<Vehicle> page;
        if (q != null && !q.isBlank()) {
            page = repo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pageable);
        } else {
            page = service.listAll(pageable);
        }
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.get(id));
    }
}
