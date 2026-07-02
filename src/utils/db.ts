import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool(config.db);
pool.on('error', (err) => console.error('Postgres error:', err));
export const query = (text: string, params?: unknown[]) => pool.query(text, params);
export default pool;
