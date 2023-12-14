import fs from 'fs/promises';
import { Currency } from 'modules/currency/model';
import path from 'path';

const DB_PATH = path.join(__dirname, '../db.json');

export interface DBFile {
  exchangeLastUpdated: null | string;
  currency: Record<string, Currency>;
}

export const readDB = async () => {
  try {
    const file = (await fs.readFile(DB_PATH)).toString('utf-8');
    const json = JSON.parse(file);

    return json as DBFile;
  } catch (e) {
    throw new Error('DB file not exist');
  }
};

export const saveDB = async (file: Record<any, any>) => {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(file, null, 2));
    return true;
  } catch (e) {
    return false;
  }
};
