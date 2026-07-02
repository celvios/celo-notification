import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { config } from '../config';
import logger from '../utils/logger';

const ses = new SESClient({
  region:      config.aws.region,
  credentials: {
    accessKeyId:     config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const sendEmail = async (
  to:       string,
  subject:  string,
  htmlBody: string,
  from?:    string
): Promise<void> => {
  try {
    await ses.send(new SendEmailCommand({
      Source:      from || config.aws.sesFrom,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: htmlBody, Charset: 'UTF-8' },
        },
      },
    }));

    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    logger.error(`Email failed to ${to}:`, err);
    throw err;
  }
};
