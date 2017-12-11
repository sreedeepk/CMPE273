package com.service;

import com.entity.Files;
import com.entity.Users;
import com.repository.FileRepository;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class FileService {
    private FileRepository fileRepository;

    private UserRepository userRepository;

    private final Path rootLocation;

    @Autowired
    public FileService(FileRepository fileRepository, UserRepository userRepository) {
        this.fileRepository = fileRepository;
        this.userRepository = userRepository;
        this.rootLocation = Paths.get("/tmp");
    }


    public Files getFile(Integer fileId, String email) {
        Files file = fileRepository.findByFileId(fileId);
        if (file != null && file.getUser() != null && file.getUser().getEmail().equals(email)) {
            return file;
        } else {
            return null;
        }
    }

    public void upload(MultipartFile file, String email) {
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file " + filename);
            }
            List<Users> users = userRepository.findByEmail(email);
            Users user = users.get(0);
            if (user == null) {
                throw new RuntimeException("Invalid user " + email);
            }
            if (filename.contains("..")) {
                // This is a security check
                throw new RuntimeException(
                        "Cannot store file with relative path outside current directory "
                                + filename);
            }
            java.nio.file.Files.createDirectories(this.rootLocation.resolve(Paths.get(String.valueOf(user.getId()))));
            Path path = this.rootLocation.resolve(Paths.get(String.valueOf(user.getId()), filename));
            java.nio.file.Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            Files files = new Files();
            files.setFileName(filename);
            files.setPath(path.toString());
            files.setUser(user);
            fileRepository.save(files);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
    }
}