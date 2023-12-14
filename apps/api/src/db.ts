import { Currency } from '@repo/structure';
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(__dirname, '../db.json');

export interface DBFile {
  exchangeLastUpdated: null | string;
  currency: Record<string, Currency>;
}

export const setupDB = async () => {
  if (fs.existsSync(DB_PATH)) return;
  await fsPromises.writeFile(
    DB_PATH,
    JSON.stringify(
      { exchangeLastUpdated: null, currency: {} } as DBFile,
      null,
      2
    )
  );
};

export const readDB = async () => {
  try {
    const file = (await fsPromises.readFile(DB_PATH)).toString('utf-8');
    const json = JSON.parse(file);

    return json as DBFile;
  } catch (e) {
    throw new Error('DB file not exist');
  }
};

export const saveDB = async (file: Record<any, any>) => {
  try {
    await fsPromises.writeFile(DB_PATH, JSON.stringify(file, null, 2));
    return true;
  } catch (e) {
    return false;
  }
};
