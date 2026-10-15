package com.portfolio.contact;

import com.portfolio.common.RateLimitException;
import com.portfolio.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository repository;
    private final ContactNotifier notifier;
    private final AppProperties.Contact settings;

    public ContactService(ContactMessageRepository repository, ContactNotifier notifier, AppProperties props) {
        this.repository = repository;
        this.notifier = notifier;
        this.settings = props.contact();
    }

    @Transactional
    public ContactResponse submit(ContactRequest request, String clientIp, String userAgent) {
        if (request.isBot()) {
            // Pretend success so bots don't learn about the honeypot
            log.info("Honeypot triggered, message ignored");
            return ContactResponse.received();
        }

        String ipHash = hash(clientIp);
        long recent = repository.countByIpHashAndCreatedAtAfter(ipHash, Instant.now().minus(Duration.ofHours(1)));
        if (recent >= settings.maxPerHour()) {
            throw new RateLimitException("Too many messages. Please try again later.");
        }

        ContactMessage saved = repository.save(new ContactMessage(
                request.name().trim(),
                request.email().trim(),
                blankToNull(request.company()),
                request.message().trim(),
                ipHash,
                truncate(userAgent, 300)));

        // Email is sent in the background so the visitor gets an instant response
        notifier.notifyNewMessage(saved.getId());
        return ContactResponse.received();
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest((settings.ipSalt() + value).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }

    private static String truncate(String s, int max) {
        return s == null || s.length() <= max ? s : s.substring(0, max);
    }
}
