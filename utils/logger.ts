import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;
const line = printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`);

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), line),
  transports: [
    new transports.Console({ format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), line) }),
    new transports.File({ filename: 'reports/logs/execution.log' }),
    new transports.File({ filename: 'reports/logs/error.log', level: 'error' }),
  ],
});
