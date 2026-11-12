import fs from 'fs';
import path from 'path';

/** Short unique suffix, e.g. "k3f9x2", used to make usernames unique per run. */
export const uniqueId = (): string => Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 4);

/** Turns "User logs in with valid credentials" into "User_logs_in_with_valid_credentials". */
export const safeFileName = (text: string): string => text.replace(/[^a-zA-Z0-9-_]+/g, '_').slice(0, 80);

/** Reads and parses a JSON file from the /data folder. */
export const readJson = <T>(fileName: string): T => {
  const filePath = path.resolve(__dirname, '..', 'data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
};
