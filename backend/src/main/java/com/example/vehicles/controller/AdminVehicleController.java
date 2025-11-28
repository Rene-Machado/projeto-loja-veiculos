package com.example.vehicles.controller;

import com.example.vehicles.entity.Vehicle;
import com.example.vehicles.service.VehicleService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/vehicles")
public class AdminVehicleController {

    private final VehicleService service;

    public AdminVehicleController(VehicleService service) {
        this.service = service;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Vehicle> create(@RequestPart("vehicle") Vehicle vehicle,
                                          @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {
        Vehicle saved = service.create(vehicle, images);
        return ResponseEntity.ok(saved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Vehicle> update(@PathVariable Long id,
                                          @RequestPart("vehicle") Vehicle payload,
                                          @RequestPart(value = "images", required = false) List<MultipartFile> images,
                                          @RequestParam(value = "replace", defaultValue = "false") boolean replace) throws IOException {
        Vehicle updated = service.update(id, payload, images, replace);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateJson(@PathVariable Long id, @RequestBody Vehicle payload) {
        return ResponseEntity.ok(service.update(id, payload));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
