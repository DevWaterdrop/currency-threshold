import { DBFile, readDB, saveDB } from 'db';
import { roundByTwo } from 'helpers';
import { sendEmailNotification } from 'modules/notification/service';
import cron from 'node-cron';

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

const cronExchangeRate = async (dbFile: DBFile) => {
  dbFile.exchangeLastUpdated = new Date(Date.now()).toISOString();
  const exchangeRate = await getExchangeRate();

  for (const [currency, rate] of Object.entries(
    exchangeRate.conversion_rates
  )) {
    if (currency === 'EUR') continue;

    let currentCurrency = dbFile.currency[currency];

    if (!currentCurrency) {
      currentCurrency = {
        bound: { upper: roundByTwo(rate * 1.5), lower: roundByTwo(rate * 0.5) },
        current: rate,
        exchange: rate,
      };
    } else {
      currentCurrency.exchange = rate;

      if (rate < currentCurrency.bound.lower) {
        await sendEmailNotification(`${currency}: LOWER ${rate}`);
      }

      if (rate > currentCurrency.bound.upper) {
        await sendEmailNotification(`${currency}: UPPER ${rate}`);
      }
    }

    dbFile.currency[currency] = currentCurrency;
  }
};

export const setupCron = async () => {
  // init
  const dbFile = await readDB();
  if (!dbFile.exchangeLastUpdated) {
    await cronExchangeRate(dbFile);
    await saveDB(dbFile);
  }

  // Every 15 minute
  cron.schedule('0 */15 * * * *', async () => {
    console.log('-- CRON --');

    const dbFile = await readDB();
    await cronExchangeRate(dbFile);
    await saveDB(dbFile);
  });
};
