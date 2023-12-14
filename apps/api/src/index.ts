import { setupCron } from 'cron';
import { createServer } from './server';

const port = process.env.PORT || 3001;
const server = createServer();
setupCron();

server.listen(port, () => {
  console.log(`api running on ${port}`);
});
