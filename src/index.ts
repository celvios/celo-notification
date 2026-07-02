import { config } from './config';
import { startGRPCServer } from './grpc';
import logger from './utils/logger';
import pool from './utils/db';

const start = async () => {
  try {
    await pool.query('SELECT 1');
    logger.info('Database connected');
  } catch (err) {
    logger.error('Database connection failed:', err);
    process.exit(1);
  }

  startGRPCServer(config.grpcPort);
  logger.info(`Celo Notification Service started in ${config.nodeEnv} mode`);
};

process.on('unhandledRejection', (err) => { logger.error('Unhandled:', err); process.exit(1); });
start();
