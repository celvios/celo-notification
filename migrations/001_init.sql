CREATE TABLE IF NOT EXISTS notification_logs (
    id             UUID PRIMARY KEY,
    business_id    UUID NOT NULL,
    channel        VARCHAR(20) NOT NULL CHECK (channel IN ('EMAIL','WHATSAPP','SMS')),
    recipient      VARCHAR(255) NOT NULL,
    template       VARCHAR(50) NOT NULL,
    status         VARCHAR(20) NOT NULL DEFAULT 'SENT' CHECK (status IN ('SENT','FAILED')),
    failure_reason TEXT,
    sent_at        TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_business ON notification_logs(business_id);
CREATE INDEX IF NOT EXISTS idx_notif_status   ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notif_sent_at  ON notification_logs(sent_at);
