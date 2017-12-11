package com.service;

import com.entity.Groups;
import com.entity.Users;
import com.repository.GroupRepository;
import com.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class GroupService {
    private GroupRepository groupRepository;

    private UserRepository userRepository;

    @Autowired
    public GroupService(GroupRepository groupRepository, UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
    }

    public void createGroup(String groupName, String email) {
        List<Users> users = userRepository.findByEmail(email);
        Users user = users.get(0);
        if (user == null) {
            throw new RuntimeException("Invalid user " + email);
        }

        Groups groups = new Groups();
        groups.setOwner(user);
        groups.getOwner().setId(user.getId());
        groups.setUsers(new ArrayList<Users>());
        groups.getUsers().add(user);
        groups.setGroupName(groupName);
        groupRepository.save(groups);
    }

    public void addMember(Integer groupId, String email) {
        List<Users> users = userRepository.findByEmail(email);
        Users user = users.get(0);
        if (user == null) {
            throw new RuntimeException("Invalid user " + email);
        }

        Groups groups = groupRepository.findByGroupId(groupId);
        if (groups == null) {
            throw new RuntimeException("Invalid group Id " + groupId);
        }

        groups.getUsers().add(user);
        groupRepository.save(groups);
    }

    public List<Users> getMembers(Integer groupId) {
        Groups groups = groupRepository.findByGroupId(groupId);
        if (groups == null) {
            throw new RuntimeException("Invalid group Id " + groupId);
        }

        return groups.getUsers();
    }

    public void deleteMembers(Integer groupId, String email) {
        Groups groups = groupRepository.findByGroupId(groupId);
        if (groups == null) {
            throw new RuntimeException("Invalid group Id " + groupId);
        }

        Users owner = groups.getOwner();
        if (owner == null || owner.getEmail() == null || email == null || !owner.getEmail().trim().equals(email.trim())) {
            throw new RuntimeException("Invalid owner " + email);
        }


        groups.setUsers(new ArrayList<Users>());
        groups.getUsers().add(owner);

        groupRepository.save(groups);
    }

    @Transactional
    public void deleteGroup(Integer groupId, String email) {
        Groups groups = groupRepository.findByGroupId(groupId);
        if (groups == null) {
            throw new RuntimeException("Invalid group Id " + groupId);
        }

        Users owner = groups.getOwner();
        if (owner == null || owner.getEmail() == null || email == null || !owner.getEmail().trim().equals(email.trim())) {
            throw new RuntimeException("Invalid owner " + email);
        }

        groupRepository.deleteByGroupId(groupId);
    }
}