package com.controller;

import com.entity.Files;
import com.service.FileService;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;

@Controller    // This means that this class is a Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/files") // This means URL's start with /demo (after Application path)
public class FileController {
    private UserService userService;

    private FileService fileService;

    @Autowired
    public FileController(UserService userService, FileService fileService) {
        this.userService = userService;
        this.fileService = fileService;
    }

    @PostMapping(path = "/upload") // Map ONLY POST Requests
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null && !email.trim().equals("")) {
            try {
                fileService.upload(file, email);
                return new ResponseEntity(null, HttpStatus.CREATED);
            } catch (Exception e) {
                return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> getFiles(HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null && !email.trim().equals("")) {
            return new ResponseEntity(userService.getFiles(email), HttpStatus.OK);
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(path = "/{fileId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getFile(@PathVariable("fileId") Integer fileId, HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null && !email.trim().equals("")) {
            Files file = fileService.getFile(fileId, email);
            if (file != null) {
                return new ResponseEntity(file, HttpStatus.OK);
            } else {
                return new ResponseEntity(file, HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }
}