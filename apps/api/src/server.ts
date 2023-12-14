import express from 'express';
import { CurrencyRouter } from 'modules/currency/controler';
import cors from 'cors';

export const createServer = () => {
  const app = express();
  app
    .disable('x-powered-by')
    .use(express.json())
    .use(cors())
    .use(CurrencyRouter);

  return app;
};
