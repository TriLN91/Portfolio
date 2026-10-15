package com.portfolio.contact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    long countByIpHashAndCreatedAtAfter(String ipHash, Instant after);
}
