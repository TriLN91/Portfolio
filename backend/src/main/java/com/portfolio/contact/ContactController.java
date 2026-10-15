package com.portfolio.contact;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactResponse submit(@Valid @RequestBody ContactRequest request, HttpServletRequest http) {
        // With server.forward-headers-strategy=framework, getRemoteAddr() is the real client IP behind a proxy
        return service.submit(request, http.getRemoteAddr(), http.getHeader(HttpHeaders.USER_AGENT));
    }
}
