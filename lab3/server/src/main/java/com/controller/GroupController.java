package com.controller;

import com.entity.Users;
import com.service.GroupService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Controller    // This means that this class is a Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/groups") // This means URL's start with /demo (after Application path)
public class GroupController {
    private GroupService groupService;

    @Autowired
    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping(path = "/create", consumes = MediaType.APPLICATION_JSON_VALUE) // Map ONLY POST Requests
    public ResponseEntity<?> createGroup(@RequestBody String group, HttpSession session) {
        String email = (String) session.getAttribute("email");
        JSONObject jsonObject = new JSONObject(group);
        String groupName = jsonObject.getString("groupName");
        if (email != null && !email.trim().equals("") && groupName != null && !groupName.trim().equals("")) {
            try {
                groupService.createGroup(groupName, email);
                return new ResponseEntity(null, HttpStatus.CREATED);
            } catch (Exception e) {
                return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "/{id}/members", consumes = MediaType.APPLICATION_JSON_VALUE) // Map ONLY POST Requests
    public ResponseEntity<?> addMembers(@RequestBody String body, @PathVariable("id") Integer groupId, HttpSession session) {
        JSONObject jsonObject = new JSONObject(body);
        String email = jsonObject.getString("email");
        if (email != null && !email.trim().equals("") && groupId != null) {
            try {
                groupService.addMember(groupId, email);
                return new ResponseEntity(null, HttpStatus.CREATED);
            } catch (Exception e) {
                return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(path = "/{id}/members", produces = MediaType.APPLICATION_JSON_VALUE) // Map ONLY POST Requests
    public ResponseEntity<?> getMembers(@PathVariable("id") Integer groupId, HttpSession session) {
        if (groupId != null) {
            try {
                List<Users> members = groupService.getMembers(groupId);
                if (members != null && members.size() > 0) {
                    return new ResponseEntity(members, HttpStatus.OK);
                } else {
                    return new ResponseEntity(new ArrayList<>(), HttpStatus.OK);
                }
            } catch (Exception e) {
                return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(path = "/{id}/members") // Map ONLY POST Requests
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> deleteMembers(@PathVariable("id") Integer groupId, HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null && !email.trim().equals("") && groupId != null) {
            try {
                groupService.deleteMembers(groupId, email);
                return new ResponseEntity(null, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping(path = "/{id}") // Map ONLY POST Requests
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<?> deleteGroup(@PathVariable("id") Integer groupId, HttpSession session) {
        String email = (String) session.getAttribute("email");
        if (email != null && !email.trim().equals("") && groupId != null) {
            try {
                groupService.deleteGroup(groupId, email);
                return new ResponseEntity(null, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } else {
            return new ResponseEntity(null, HttpStatus.BAD_REQUEST);
        }
    }
}