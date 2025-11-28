package com.example.vehicles.repository;

import com.example.vehicles.entity.Vehicle;
import com.example.vehicles.entity.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Page<Vehicle> findByType(VehicleType type, Pageable pageable);
    Page<Vehicle> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String t, String d, Pageable pageable);
}
