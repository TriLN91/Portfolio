package com.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Body of POST /api/contact.
 * {@code website} is a honeypot: the field is hidden on the page, so only bots fill it in.
 */
public record ContactRequest(
        @NotBlank(message = "Please enter your name")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @NotBlank(message = "Please enter your email")
        @Email(message = "Please enter a valid email address")
        @Size(max = 200, message = "Email must be at most 200 characters")
        String email,

        @Size(max = 150, message = "Company must be at most 150 characters")
        String company,

        @NotBlank(message = "Please write a message")
        @Size(min = 10, max = 4000, message = "Message must be between 10 and 4000 characters")
        String message,

        String website
) {
    boolean isBot() {
        return website != null && !website.isBlank();
    }
}
