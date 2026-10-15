CREATE TABLE contact_messages (
    id          BIGSERIAL    PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(200) NOT NULL,
    company     VARCHAR(150),
    message     TEXT         NOT NULL,
    ip_hash     VARCHAR(64)  NOT NULL,
    user_agent  VARCHAR(300),
    email_sent  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Used by the rate limit check (messages per IP in the last hour)
CREATE INDEX idx_contact_messages_ip_created ON contact_messages (ip_hash, created_at);
