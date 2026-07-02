import { query } from '../utils/db';
import { v4 as uuidv4 } from 'uuid';

export const createLog = async (
  businessId: string,
  channel:    string,
  recipient:  string,
  template:   string,
  status:     string,
  failureReason?: string
): Promise<string> => {
  const id = uuidv4();
  await query(
    `INSERT INTO notification_logs (id, business_id, channel, recipient, template, status, failure_reason, sent_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())`,
    [id, businessId, channel, recipient, template, status, failureReason || '']
  );
  return id;
};

export const getLog = async (id: string) => {
  const result = await query('SELECT * FROM notification_logs WHERE id=$1', [id]);
  return result.rows[0] || null;
};

export const listLogs = async (businessId: string, limit: number, offset: number) => {
  const [logs, count] = await Promise.all([
    query(
      'SELECT * FROM notification_logs WHERE business_id=$1 ORDER BY sent_at DESC LIMIT $2 OFFSET $3',
      [businessId, limit, offset]
    ),
    query('SELECT COUNT(*) as total FROM notification_logs WHERE business_id=$1', [businessId]),
  ]);
  return { logs: logs.rows, total: parseInt(count.rows[0].total) };
};
