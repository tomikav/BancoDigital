package org.example.bancodigitalbe.adapters.in.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FrontController {

    @GetMapping({"/login", "/registro", "/app", "/app/**"})
    public String index() {
        return "forward:/index.html";
    }
}
