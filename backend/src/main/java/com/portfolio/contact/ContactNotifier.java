package com.portfolio.contact;

import com.portfolio.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

/**
 * Emails you when someone sends a message through the contact form.
 * Prefers Resend (HTTPS API) when configured, since most free hosts — Render included —
 * block outbound SMTP. Falls back to SMTP, which is what local dev (Mailpit) uses.
 */
@Component
public class ContactNotifier {

    private static final Logger log = LoggerFactory.getLogger(ContactNotifier.class);

    private final JavaMailSender mailSender;
    private final ContactMessageRepository repository;
    private final ApplicationEventPublisher events;
    private final AppProperties.Contact settings;
    private final AppProperties.Resend resend;
    private final RestClient restClient = RestClient.create();

    public ContactNotifier(JavaMailSender mailSender, ContactMessageRepository repository,
                           ApplicationEventPublisher events, AppProperties props) {
        this.mailSender = mailSender;
        this.repository = repository;
        this.events = events;
        this.settings = props.contact();
        this.resend = props.resend();
    }

    record NewMessageEvent(Long id) {}

    /** Called inside the save transaction; the email goes out only after the commit succeeds */
    public void notifyNewMessage(Long id) {
        events.publishEvent(new NewMessageEvent(id));
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onNewMessage(NewMessageEvent event) {
        repository.findById(event.id()).ifPresent(msg -> {
            boolean sent = resend.isConfigured() ? sendViaResend(msg) : sendViaSmtp(msg);
            if (sent) {
                msg.markEmailSent();
                repository.save(msg);
            }
        });
    }

    private String bodyText(ContactMessage msg) {
        return """
                Name:    %s
                Email:   %s
                Company: %s

                %s
                """.formatted(msg.getName(), msg.getEmail(),
                msg.getCompany() == null ? "-" : msg.getCompany(), msg.getMessage());
    }

    private boolean sendViaResend(ContactMessage msg) {
        try {
            Map<String, Object> body = Map.of(
                    "from", resend.from(),
                    "to", List.of(settings.notifyTo()),
                    "reply_to", msg.getEmail(),
                    "subject", "Portfolio: new message from " + msg.getName(),
                    "text", bodyText(msg));
            restClient.post()
                    .uri("https://api.resend.com/emails")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + resend.apiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (RestClientException e) {
            // The message is still saved in the database; you can read it there
            log.warn("Could not send notification email via Resend for message {}: {}", msg.getId(), e.getMessage());
            return false;
        }
    }

    private boolean sendViaSmtp(ContactMessage msg) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(settings.from());
            mail.setTo(settings.notifyTo());
            mail.setReplyTo(msg.getEmail());
            mail.setSubject("Portfolio: new message from " + msg.getName());
            mail.setText(bodyText(msg));
            mailSender.send(mail);
            return true;
        } catch (MailException e) {
            log.warn("Could not send notification email via SMTP for message {}: {}", msg.getId(), e.getMessage());
            return false;
        }
    }
}
