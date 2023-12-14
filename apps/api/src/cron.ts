import { Currency } from '@repo/structure';
import { roundByTwo } from '@repo/utils';
import { DBFile, readDB, saveDB } from 'db';

import { sendEmailNotification } from 'modules/notification/service';
import cron from 'node-cron';
import { PREFERRED_CURRENCIES } from 'shared/const';

interface ExchangeData {
  conversion_rates: Record<string, number>;
}

const EXCHANGE_KEY = process.env.EXCHANGE_KEY;

const getExchangeRate = async () => {
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${EXCHANGE_KEY}/latest/EUR`
  );
  const data = await res.json();
  return data as ExchangeData;
};

const sendNotification = async (currency: Currency, rate = 10) => {
  if (!currency.visible) return;

  if (rate < currency.bound.lower) {
    await sendEmailNotification(`${currency}: LOWER ${rate}`);
  }

  if (rate > currency.bound.upper) {
    await sendEmailNotification(`${currency}: UPPER ${rate}`);
  }
};

const cronExchangeRate = async (dbFile: DBFile) => {
  const cloneDB = structuredClone(dbFile);

  cloneDB.exchangeLastUpdated = new Date(Date.now()).toISOString();
  const exchangeRate = await getExchangeRate();

  for (const [currency, rate] of Object.entries(
    exchangeRate.conversion_rates
  )) {
    if (currency === 'EUR') continue;
    let currentCurrency = structuredClone(cloneDB.currency[currency]);

    if (!currentCurrency) {
      const preferred = PREFERRED_CURRENCIES.includes(currency);

      currentCurrency = {
        bound: { upper: roundByTwo(rate * 1.5), lower: roundByTwo(rate * 0.5) },
        current: rate,
        exchange: rate,
        visible: preferred,
        favorite: preferred,
      };
    } else {
      currentCurrency.exchange = rate;
      await sendNotification(currentCurrency, rate);
    }

    cloneDB.currency[currency] = currentCurrency;
  }

  return cloneDB;
};

export const setupCron = async () => {
  // init
  const dbFile = await readDB();
  if (!dbFile.exchangeLastUpdated) {
    const db = await cronExchangeRate(dbFile);
    await saveDB(db);
  }

  // Every 15 minute
  cron.schedule('0 */15 * * * *', async () => {
    console.log('-- CRON --');

    const dbFile = await readDB();
    const db = await cronExchangeRate(dbFile);
    await saveDB(db);
  });
};
