import { DBFile, readDB, saveDB } from 'db';
import { PREFERRED_CURRENCIES } from 'shared/const';

export const setCurrency = async (
  currencyKey: string,
  current?: number,
  upper?: number,
  lower?: number,
  favorite?: boolean,
  visible?: boolean
) => {
  const dbFile = await readDB();
  const cloneDB = structuredClone(dbFile);
  const currency = _getCurrency(currencyKey, cloneDB);

  currency.current = current ?? currency.current;
  currency.bound.upper = upper ?? currency.bound.upper;
  currency.bound.lower = lower ?? currency.bound.lower;
  currency.favorite = favorite ?? currency.favorite;
  currency.visible = visible ?? currency.visible;

  cloneDB.currency[currencyKey] = currency;

  await saveDB(cloneDB);
};

export const getCurrencies = async () => {
  const dbFile = await readDB();
  return dbFile.currency;
};

const _getCurrency = (currencyKey: string, dbFile: DBFile) => {
  if (!dbFile.currency[currencyKey]) {
    const preferred = PREFERRED_CURRENCIES.includes(currencyKey);

    return {
      bound: {
        lower: 1.5,
        upper: 0.5,
      },
      current: 1,
      exchange: 1,
      visible: preferred,
      favorite: preferred,
    };
  }

  return structuredClone(dbFile.currency[currencyKey]);
};
