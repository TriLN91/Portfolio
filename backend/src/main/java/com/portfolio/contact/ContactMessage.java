package com.portfolio.contact;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 200)
    private String email;

    @Column(length = 150)
    private String company;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    /** SHA-256 of the sender IP (never store raw IPs), used for rate limiting */
    @Column(name = "ip_hash", nullable = false, length = 64)
    private String ipHash;

    @Column(name = "user_agent", length = 300)
    private String userAgent;

    @Column(name = "email_sent", nullable = false)
    private boolean emailSent;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected ContactMessage() {}

    public ContactMessage(String name, String email, String company, String message, String ipHash, String userAgent) {
        this.name = name;
        this.email = email;
        this.company = company;
        this.message = message;
        this.ipHash = ipHash;
        this.userAgent = userAgent;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getCompany() { return company; }
    public String getMessage() { return message; }
    public String getIpHash() { return ipHash; }
    public String getUserAgent() { return userAgent; }
    public boolean isEmailSent() { return emailSent; }
    public Instant getCreatedAt() { return createdAt; }

    public void markEmailSent() { this.emailSent = true; }
}
