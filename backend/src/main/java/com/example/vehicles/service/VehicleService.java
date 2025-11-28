package com.example.vehicles.service;

import com.example.vehicles.entity.Vehicle;
import com.example.vehicles.exception.ResourceNotFoundException;
import com.example.vehicles.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class VehicleService {
    private final VehicleRepository repo;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public VehicleService(VehicleRepository repo) {
        this.repo = repo;
    }

    public Page<Vehicle> listAll(Pageable pageable) {
        return repo.findAll(pageable);
    }

    public Vehicle get(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
    }

    public Vehicle create(Vehicle vehicle, List<MultipartFile> images) throws IOException {
        Vehicle saved = repo.save(vehicle);
        if (images != null && !images.isEmpty()) {
            Path vehicleDir = Paths.get(uploadDir, String.valueOf(saved.getId()));
            Files.createDirectories(vehicleDir);
            List<String> paths = new ArrayList<>();
            for (MultipartFile file : images) {
                String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
                Path dest = vehicleDir.resolve(filename);
                file.transferTo(dest);
                // store relative path like "{vehicleId}/{filename}"
                paths.add(Paths.get(String.valueOf(saved.getId()), filename).toString().replace('\\', '/'));
            }
            saved.setImagePaths(paths);
            saved = repo.save(saved);
        }
        return saved;
    }

    public Vehicle update(Long id, Vehicle payload) {
        Vehicle v = get(id);
        v.setTitle(payload.getTitle());
        v.setDescription(payload.getDescription());
        v.setPrice(payload.getPrice());
        v.setYear(payload.getYear());
        v.setMileage(payload.getMileage());
        v.setType(payload.getType());
        return repo.save(v);
    }

    public Vehicle update(Long id, Vehicle payload, List<MultipartFile> images) throws IOException {
        return update(id, payload, images, false);
    }

    public Vehicle update(Long id, Vehicle payload, List<MultipartFile> images, boolean replace) throws IOException {
        Vehicle v = update(id, payload);
        if (images != null && !images.isEmpty()) {
            Path vehicleDir = Paths.get(uploadDir, String.valueOf(v.getId()));
            Files.createDirectories(vehicleDir);
            List<String> paths = new ArrayList<>();
            for (MultipartFile file : images) {
                String filename = System.currentTimeMillis() + "-" + file.getOriginalFilename();
                Path dest = vehicleDir.resolve(filename);
                file.transferTo(dest);
                paths.add(Paths.get(String.valueOf(v.getId()), filename).toString().replace('\\', '/'));
            }

            if (replace) {
                // delete existing files
                if (v.getImagePaths() != null) {
                    for (String p : v.getImagePaths()) {
                        try { Files.deleteIfExists(Paths.get(uploadDir, p)); } catch (IOException ignored) {}
                    }
                }
                v.setImagePaths(paths);
            } else {
                List<String> existing = v.getImagePaths() != null ? new ArrayList<>(v.getImagePaths()) : new ArrayList<>();
                existing.addAll(paths);
                v.setImagePaths(existing);
            }

            v = repo.save(v);
        }
        return v;
    }

    public void delete(Long id) throws IOException {
        Vehicle v = get(id);
        if (v.getImagePaths() != null) {
            for (String p : v.getImagePaths()) {
                try { Files.deleteIfExists(Paths.get(uploadDir, p)); } catch (IOException ignored) {}
            }
            Path folder = Paths.get(uploadDir, String.valueOf(v.getId()));
            try { Files.deleteIfExists(folder); } catch (IOException ignored) {}
        }
        repo.deleteById(id);
    }
}
