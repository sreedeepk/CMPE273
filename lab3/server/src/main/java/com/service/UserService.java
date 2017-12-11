package com.service;

import com.entity.Files;
import com.entity.Users;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Iterable<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public void addUser(Users user) {
        userRepository.save(user);
    }

    public List<Users> signup(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public List<Users> login(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }

    public List<Users> info(String email) {
        return userRepository.findByEmail(email);
    }

    public List<Files> getFiles(String email) {
        List<Users> users = userRepository.findByEmail(email);
        List<Files> files = new ArrayList<Files>();
        for (Users user : users) {
            files = user.getFiles();
        }
        return files;
    }
}