package com.controller;

import com.service.FileService;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller    // This means that this class is a Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/folders") // This means URL's start with /demo (after Application path)
public class FolderController {
    private UserService userService;

    private FileService fileService;

    @Autowired
    public FolderController(UserService userService, FileService fileService) {
        this.userService = userService;
        this.fileService = fileService;
    }

    @GetMapping(path = "/{id}/share", produces = MediaType.APPLICATION_JSON_VALUE) // Map ONLY POST Requests
    public ResponseEntity<?> share(@RequestParam("id") String id, HttpSession session) {
        if (id != null && !id.trim().equals("")) {
            Map<String, String> result = new HashMap<>();
            result.put("link", "/folders/" + id);
            return new ResponseEntity(result, HttpStatus.OK);
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> getFiles(@RequestParam("id") String id, HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null && !email.trim().equals("")) {
            return new ResponseEntity("", HttpStatus.OK);
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }
}