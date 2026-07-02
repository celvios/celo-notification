import path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { getTemplate } from './services/templates';
import { sendEmail } from './services/email';
import { sendWhatsApp, sendSMS } from './services/sms';
import * as NotificationModel from './models/notification';
import logger from './utils/logger';

const packageDef = protoLoader.loadSync(
  path.join(__dirname, '../proto/notification.proto'),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);

const proto = grpc.loadPackageDefinition(packageDef) as any;

// channel mapping from proto enum
const CHANNELS = ['EMAIL', 'WHATSAPP', 'SMS'];
const TEMPLATES = [
  'INVOICE_SENT', 'INVOICE_REMINDER', 'PAYMENT_RECEIVED',
  'INVOICE_OVERDUE', 'SETTLEMENT_DONE', 'WELCOME'
];

const processNotification = async (req: any): Promise<{ success: boolean; id: string; message: string }> => {
  const channel  = CHANNELS[req.channel]  || 'EMAIL';
  const template = TEMPLATES[req.template] || 'INVOICE_SENT';

  const payload = {
    businessName:  req.payload?.business_name  || '',
    contactName:   req.payload?.contact_name   || '',
    invoiceNumber: req.payload?.invoice_number || '',
    amount:        req.payload?.amount         || '',
    currency:      req.payload?.currency       || '',
    dueDate:       req.payload?.due_date       || '',
    paymentLink:   req.payload?.payment_link   || '',
    extra:         req.payload?.extra          || '{}',
  };

  const tmpl = getTemplate(template, payload);
  let status = 'SENT';
  let failureReason = '';

  try {
    if (channel === 'EMAIL') {
      await sendEmail(req.to_email, tmpl.subject, tmpl.emailBody);
    } else if (channel === 'WHATSAPP') {
      await sendWhatsApp(req.to_phone, tmpl.whatsapp);
    } else if (channel === 'SMS') {
      await sendSMS(req.to_phone, tmpl.sms);
    }
  } catch (err: any) {
    status = 'FAILED';
    failureReason = err.message;
  }

  const id = await NotificationModel.createLog(
    req.business_id,
    channel,
    channel === 'EMAIL' ? req.to_email : req.to_phone,
    template,
    status,
    failureReason
  );

  return {
    success: status === 'SENT',
    id,
    message: status === 'SENT' ? 'Notification sent' : failureReason,
  };
};

const handlers = {
  SendNotification: async (call: any, callback: any) => {
    try {
      const result = await processNotification(call.request);
      callback(null, {
        success:         result.success,
        notification_id: result.id,
        message:         result.message,
      });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  // send multiple notifications — fire all in parallel
  SendBulk: async (call: any, callback: any) => {
    try {
      const results = await Promise.allSettled(
        call.request.notifications.map((n: any) => processNotification(n))
      );

      const sent   = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
      const failed = results.length - sent;

      callback(null, { sent, failed });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  GetDeliveryStatus: async (call: any, callback: any) => {
    try {
      const log = await NotificationModel.getLog(call.request.notification_id);
      if (!log) return callback({ code: grpc.status.NOT_FOUND, message: 'Notification not found' });

      callback(null, {
        notification_id: log.id,
        status:          log.status,
        channel:         log.channel,
        sent_at:         log.sent_at?.toISOString?.() || log.sent_at,
        failure_reason:  log.failure_reason,
      });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },

  ListNotifications: async (call: any, callback: any) => {
    try {
      const { business_id, limit, offset } = call.request;
      const result = await NotificationModel.listLogs(business_id, limit || 20, offset || 0);

      callback(null, {
        notifications: result.logs.map((l: any) => ({
          notification_id: l.id,
          status:          l.status,
          channel:         l.channel,
          sent_at:         l.sent_at?.toISOString?.() || l.sent_at,
          failure_reason:  l.failure_reason,
        })),
        total: result.total,
      });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message });
    }
  },
};

export const startGRPCServer = (port: string) => {
  const server = new grpc.Server();
  server.addService(proto.notification.NotificationService.service, handlers);

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, boundPort) => {
      if (err) { logger.error('Failed to start:', err); process.exit(1); }
      logger.info(`Notification gRPC server running on port ${boundPort}`);
    }
  );
};
