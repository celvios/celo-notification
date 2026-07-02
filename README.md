# celo-notification

Notification Service for Celo — email via AWS SES, WhatsApp and SMS via Twilio, template engine, delivery tracking.

## Stack

Node.js · TypeScript · PostgreSQL · gRPC · AWS SES · Twilio

## Templates

| Template | Channels |
|---|---|
| INVOICE_SENT | Email + WhatsApp |
| INVOICE_REMINDER | Email + WhatsApp |
| PAYMENT_RECEIVED | Email + WhatsApp |
| INVOICE_OVERDUE | Email + WhatsApp + SMS |
| SETTLEMENT_DONE | Email |
| WELCOME | Email + WhatsApp |

## What It Does

| RPC | Description |
|---|---|
| SendNotification | Send single notification via email, WhatsApp, or SMS |
| SendBulk | Send multiple notifications in parallel |
| GetDeliveryStatus | Check if a notification was delivered |
| ListNotifications | Notification history for a business |

## Run

```bash
docker-compose up --build
```

## Author

Tolu King · Systems Architect & Blockchain Engineer
[LinkedIn](https://linkedin.com/in/toluking) · [Celvios Systems](https://github.com/celvios)
