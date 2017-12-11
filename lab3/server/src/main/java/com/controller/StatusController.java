package com.controller;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller    // This means that this class is a Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/status") // This means URL's start with /demo (after Application path)
public class StatusController {

    @GetMapping(path="/{name}",produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Map<String, String> hello(@PathVariable("name") String input) {
        Map<String, String> result = new HashMap<String, String>();
        result.put("id", "1");
        result.put("message", "Hello " + input);
        return result;
    }

}
