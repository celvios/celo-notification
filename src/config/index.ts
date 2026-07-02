import dotenv from 'dotenv';
dotenv.config();

export const config = {
  grpcPort: process.env.GRPC_PORT || '50057',
  nodeEnv:  process.env.NODE_ENV  || 'development',

  db: {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME     || 'celo_platform',
    user:     process.env.DB_USER     || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
  },

  aws: {
    region:          process.env.AWS_REGION           || 'us-east-1',
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID    || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    sesFrom:         process.env.AWS_SES_FROM          || 'notifications@celo.finance',
  },

  twilio: {
    accountSid:   process.env.TWILIO_ACCOUNT_SID   || '',
    authToken:    process.env.TWILIO_AUTH_TOKEN     || '',
    whatsappFrom: process.env.TWILIO_WHATSAPP_FROM  || 'whatsapp:+14155238886',
    smsFrom:      process.env.TWILIO_SMS_FROM       || '',
  },
};
