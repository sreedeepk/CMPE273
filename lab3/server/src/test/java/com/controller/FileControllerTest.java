package com.controller;

import com.entity.Files;
import com.entity.Users;
import com.repository.FileRepository;
import com.repository.UserRepository;
import com.service.FileService;
import com.service.UserService;
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
import static org.mockito.Mockito.when;

public class FileControllerTest {
    private FileController fileController;

    private UserService userService;

    private FileService fileService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileRepository fileRepository;

    @Mock
    private HttpSession session;

    @Before
    public void setUp() throws Exception {
        MockitoAnnotations.initMocks(this);
        this.userService = new UserService(userRepository);
        this.fileService = new FileService(fileRepository, userRepository);
        this.fileController = new FileController(userService, fileService);
    }

    @Test
    public void testGetFiles() throws Exception {
        when(session.getAttribute("email")).thenReturn("testing@gmail.com");
        List<Users> users = new ArrayList<>();
        Users user = Mockito.mock(Users.class);
        users.add(user);
        when(userRepository.findByEmail("testing@gmail.com")).thenReturn(users);

        List<Files> files = new ArrayList<>();
        files.add(Mockito.mock(Files.class));
        files.add(Mockito.mock(Files.class));

        when(user.getFiles()).thenReturn(files);
        assertEquals("Invalid response", new ResponseEntity(files, HttpStatus.OK), fileController.getFiles(session));
    }

    @Test
    public void testGetFile() throws Exception {
        when(session.getAttribute("email")).thenReturn("testing@gmail.com");

        Files file = Mockito.mock(Files.class);
        Users user = Mockito.mock(Users.class);
        when(user.getEmail()).thenReturn("testing@gmail.com");
        when(file.getUser()).thenReturn(user);
        when(fileRepository.findByFileId(1)).thenReturn(file);
        assertEquals("Invalid response", new ResponseEntity(file, HttpStatus.OK), fileController.getFile(1, session));
    }

}