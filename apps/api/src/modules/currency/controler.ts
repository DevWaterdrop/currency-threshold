import { Router } from 'express';
import { getCurrencies, setCurrency } from './service';

export const CurrencyRouter = Router();

CurrencyRouter.get('/currency', async (_req, res) => {
  const data = await getCurrencies();
  return res.json(data);
});

CurrencyRouter.patch('/currency/:currencyKey', async (req, res) => {
  const { currencyKey } = req.params;
  const { upper, current, lower } = req.body;

  const uppercaseKey = currencyKey.toUpperCase();
  const data = await setCurrency(uppercaseKey, current, upper, lower);

  return res.json(data);
});
