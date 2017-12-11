package com.repository;

import com.entity.Groups;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository

public interface GroupRepository extends CrudRepository<Groups, Long> {
    Groups findByGroupId(Integer groupId);

    void deleteByGroupId(Integer groupId);
}