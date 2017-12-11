package com.repository;

import com.entity.Users;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository

public interface UserRepository extends CrudRepository<Users, Long> {
    List<Users> findByEmailAndPassword(String email, String password);

    List<Users> findByEmail(String email);
}