package com.controller;

import com.entity.Users;
import com.service.UserService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

@Controller    // This means that this class is a Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/users") // This means URL's start with /demo (after Application path)
public class UserController {
    private UserService userService;

    private ShaPasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, ShaPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping(path = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE) // Map ONLY POST Requests
    public ResponseEntity<?> addNewUser(@RequestBody Users user) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        if (user != null && user.getEmail() != null && !user.getEmail().trim().equals("") && user.getPassword() != null && !user.getPassword().trim().equals("")) {
            try {
                user.setEmail(user.getEmail().trim());
                user.setPassword(passwordEncoder.encodePassword(user.getPassword(), null));
                userService.addUser(user);
                System.out.println("Saved");
                return new ResponseEntity(null, HttpStatus.CREATED);
            } catch (Exception e) {
                return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "/signin", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> login(@RequestBody String user, HttpSession session) {
        JSONObject jsonObject = new JSONObject(user);
        String email = jsonObject.getString("email");
        String password = jsonObject.getString("password");
        if (email != null && !email.trim().equals("") && password != null && !password.trim().equals("")) {
            try {
                List<Users> users = userService.login(email, passwordEncoder.encodePassword(password, null));
                if (users != null && users.size() > 0) {
                    session.setAttribute("email", jsonObject.getString("email"));
                    return new ResponseEntity(HttpStatus.OK);
                } else {
                    return new ResponseEntity(HttpStatus.FORBIDDEN);
                }
            } catch (Exception e) {
                return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(value = "/signout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> logout(HttpSession session) {
        System.out.println(session.getAttribute("email"));
        session.invalidate();
        return new ResponseEntity(HttpStatus.OK);
    }

    @GetMapping(path = "/info", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    Users getUserInfo(HttpSession session) {
        String email = (String) session.getAttribute("email");
        Users user = new Users();
        if (email != null) {
            List<Users> users = userService.info(email);
            user = users.get(0);
            user.setPassword(null);
        }
        // This returns a JSON with the users
        return user;
    }
}