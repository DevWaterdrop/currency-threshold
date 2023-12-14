import { DBFile, readDB, saveDB } from 'db';

export const setCurrency = async (
  currencyKey: string,
  current?: number,
  upper?: number,
  lower?: number
) => {
  const dbFile = await readDB();
  const currency = _getCurrency(currencyKey, dbFile);

  currency.current = current ?? currency.current;
  currency.bound.upper = upper ?? currency.bound.upper;
  currency.bound.lower = lower ?? currency.bound.lower;

  await saveDB(dbFile);
};

export const getCurrencies = async () => {
  const dbFile = await readDB();
  return dbFile.currency;
};

const _getCurrency = (currencyKey: string, dbFile: DBFile) => {
  if (!dbFile.currency[currencyKey]) {
    dbFile.currency[currencyKey] = {
      bound: {
        lower: 1.5,
        upper: 0.5,
      },
      current: 1,
      exchange: 1,
    };
  }

  return dbFile.currency[currencyKey];
};
