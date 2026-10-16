package com.portfolio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/** Typed view of the "app.*" settings in application.yml */
@ConfigurationProperties(prefix = "app")
public record AppProperties(List<String> corsOrigins, Contact contact, GitHub github, Resend resend) {

    public record Contact(String notifyTo, String from, int maxPerHour, String ipSalt) {}

    public record GitHub(String username, String token, int cacheMinutes) {}

    /** Resend (resend.com): sends notification emails over HTTPS, since most free hosts block outbound SMTP */
    public record Resend(String apiKey, String from) {
        public boolean isConfigured() {
            return apiKey != null && !apiKey.isBlank();
        }
    }
}
