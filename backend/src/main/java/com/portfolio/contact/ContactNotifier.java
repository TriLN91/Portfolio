package com.portfolio.contact;

import com.portfolio.config.AppProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.context.ApplicationEventPublisher;

/** Emails you when someone sends a message through the contact form */
@Component
public class ContactNotifier {

    private static final Logger log = LoggerFactory.getLogger(ContactNotifier.class);

    private final JavaMailSender mailSender;
    private final ContactMessageRepository repository;
    private final ApplicationEventPublisher events;
    private final AppProperties.Contact settings;

    public ContactNotifier(JavaMailSender mailSender, ContactMessageRepository repository,
                           ApplicationEventPublisher events, AppProperties props) {
        this.mailSender = mailSender;
        this.repository = repository;
        this.events = events;
        this.settings = props.contact();
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
            try {
                SimpleMailMessage mail = new SimpleMailMessage();
                mail.setFrom(settings.from());
                mail.setTo(settings.notifyTo());
                mail.setReplyTo(msg.getEmail());
                mail.setSubject("Portfolio: new message from " + msg.getName());
                mail.setText("""
                        Name:    %s
                        Email:   %s
                        Company: %s

                        %s
                        """.formatted(msg.getName(), msg.getEmail(),
                        msg.getCompany() == null ? "-" : msg.getCompany(), msg.getMessage()));
                mailSender.send(mail);
                msg.markEmailSent();
                repository.save(msg);
            } catch (MailException e) {
                // The message is still saved in the database; you can read it there
                log.warn("Could not send notification email for message {}: {}", msg.getId(), e.getMessage());
            }
        });
    }
}
