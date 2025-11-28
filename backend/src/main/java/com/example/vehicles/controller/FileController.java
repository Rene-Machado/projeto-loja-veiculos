package com.example.vehicles.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/files")
public class FileController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @GetMapping("/{vehicleId}/{filename:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable Long vehicleId, @PathVariable String filename) throws MalformedURLException {
        // Serve files from configured uploadDir using vehicleId/filename (no absolute path from client)
        Path base = Paths.get(uploadDir).toAbsolutePath().normalize();
        Path file = base.resolve(Paths.get(String.valueOf(vehicleId), filename)).normalize();

        if (!file.startsWith(base)) {
            return ResponseEntity.badRequest().build();
        }

        Resource res = new UrlResource(file.toUri());
        try {
            if (!res.exists() || !res.isReadable()) return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFileName().toString() + "\"")
                .body(res);
    }
}
