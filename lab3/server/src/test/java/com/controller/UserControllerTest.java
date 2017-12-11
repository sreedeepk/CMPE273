package com.controller;

import com.entity.Users;
import com.repository.UserRepository;
import com.service.UserService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.encoding.ShaPasswordEncoder;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

public class UserControllerTest {
    private UserController userController;

    @Mock
    private ShaPasswordEncoder shaPasswordEncoder;

    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HttpSession session;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        this.userService = new UserService(userRepository);
        this.userController = new UserController(userService, shaPasswordEncoder);
    }

    @Test
    public void testAddNewUser() throws Exception {
        String body = "{\"firstName\":\"fn\",\"lastName\":\"ln\",\"email\":\"fn.ln@gmail.com\",\"password\":\"testing\",\"overview\":\"my overview\",\"work\":\"my work\",\"interests\":\"my interests\"}";

        Users user = Mockito.mock(Users.class);
        when(user.getEmail()).thenReturn("testing@gmail.com");
        when(user.getPassword()).thenReturn("password");
        when(shaPasswordEncoder.encodePassword(anyString(), anyString())).thenReturn("new password");

        userController.addNewUser(user);

        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void testLogin() throws Exception {
        String body = "{\"email\":\"fn.ln@gmail.com\",\"password\":\"testing\"}";
        List<Users> users = new ArrayList<>();
        users.add(Mockito.mock(Users.class));
        when(shaPasswordEncoder.encodePassword(anyString(), anyString())).thenReturn("new password");

        when(userRepository.findByEmailAndPassword("fn.ln@gmail.com", "new password")).thenReturn(users);

        userController.login(body, session);

        Mockito.verify(session, Mockito.times(1)).setAttribute(eq("email"), anyString());
    }

    @Test
    public void testLogout() throws Exception {
        // Checks that the session is invalidated
        userController.logout(session);
        Mockito.verify(session, Mockito.times(1)).invalidate();
    }

    @Test
    public void testGetUserInfo() throws Exception {
        when(session.getAttribute("email")).thenReturn("testing@gmail.com");

        List<Users> users = new ArrayList<>();
        Users user = Mockito.mock(Users.class);
        users.add(user);

        when(userRepository.findByEmail("testing@gmail.com")).thenReturn(users);

        assertEquals("Invalid user info", user, userController.getUserInfo(session));
    }

}