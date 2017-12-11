package com.controller;

import com.entity.Groups;
import com.entity.Users;
import com.repository.GroupRepository;
import com.repository.UserRepository;
import com.service.GroupService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.*;

public class GroupControllerTest {
    private GroupController groupController;

    private GroupService groupService;

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpSession session;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        this.groupService = new GroupService(groupRepository, userRepository);
        this.groupController = new GroupController(groupService);
    }

    @Test
    public void testCreateGroup() throws Exception {
        String body = "{\"groupName\":\"test\"}";
        when(session.getAttribute("email")).thenReturn("testing@gmail.com");

        Users user = Mockito.mock(Users.class);
        List<Users> users = new ArrayList<>();
        users.add(user);

        when(userRepository.findByEmail("testing@gmail.com")).thenReturn(users);

        groupController.createGroup(body, session);
        verify(groupRepository, times(1)).save(any(Groups.class));
    }

    @Test
    public void testAddMembers() throws Exception {
        String body = "{\"email\":\"test@gmail.com\"}";
        Integer groupId = 1;
        when(session.getAttribute("email")).thenReturn("testing@gmail.com");

        Groups group = Mockito.mock(Groups.class);
        Users user = Mockito.mock(Users.class);
        List<Users> users = new ArrayList<>();
        List<Users> tempUsers = new ArrayList<>();
        tempUsers.add(user);

        when(groupRepository.findByGroupId(groupId)).thenReturn(group);
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(tempUsers);
        when(group.getUsers()).thenReturn(users);

        assertEquals(0, users.size());
        groupController.addMembers(body, groupId, session);
        assertEquals(1, users.size());

        verify(groupRepository, times(1)).save(group);
    }

    @Test
    public void testGetMembers() throws Exception {
        Integer groupId = 1;
        when(session.getAttribute("email")).thenReturn("testing@gmail.com");

        Groups group = Mockito.mock(Groups.class);
        Users user = Mockito.mock(Users.class);
        List<Users> users = new ArrayList<>();
        users.add(user);

        when(groupRepository.findByGroupId(groupId)).thenReturn(group);
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(users);
        when(group.getUsers()).thenReturn(users);

        assertEquals("Invalid response", new ResponseEntity(users, HttpStatus.OK), groupController.getMembers(groupId, session));
    }

    @Test
    public void testDeleteMembers() throws Exception {
        Integer groupId = 1;
        when(session.getAttribute("email")).thenReturn("testing@gmail.com");

        Groups group = Mockito.mock(Groups.class);
        Users user = Mockito.mock(Users.class);
        when(groupRepository.findByGroupId(groupId)).thenReturn(group);
        when(group.getOwner()).thenReturn(user);
        when(user.getEmail()).thenReturn("testing@gmail.com");
        groupController.deleteMembers(groupId, session);
        verify(groupRepository, times(1)).save(group);
    }

}