import twilio from 'twilio';
import { config } from '../config';
import logger from '../utils/logger';

const client = twilio(config.twilio.accountSid, config.twilio.authToken);

export const sendWhatsApp = async (to: string, message: string): Promise<void> => {
  try {
    const toPhone = to.startsWith('+') ? `whatsapp:${to}` : `whatsapp:+${to}`;

    await client.messages.create({
      from: config.twilio.whatsappFrom,
      to:   toPhone,
      body: message,
    });

    logger.info(`WhatsApp sent to ${to}`);
  } catch (err) {
    // WhatsApp failure should never block the flow
    logger.error(`WhatsApp failed to ${to}:`, err);
    throw err;
  }
};

export const sendSMS = async (to: string, message: string): Promise<void> => {
  try {
    const toPhone = to.startsWith('+') ? to : `+${to}`;

    await client.messages.create({
      from: config.twilio.smsFrom,
      to:   toPhone,
      body: message,
    });

    logger.info(`SMS sent to ${to}`);
  } catch (err) {
    logger.error(`SMS failed to ${to}:`, err);
    throw err;
  }
};
