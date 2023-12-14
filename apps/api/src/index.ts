import { setupCron } from 'cron';
import { createServer } from './server';
import { setupDB } from 'db';

(async () => {
  const port = process.env.PORT || 3001;
  const server = createServer();

  await setupDB();
  await setupCron();

  server.listen(port, () => {
    console.log(`api running on ${port}`);
  });
})();
