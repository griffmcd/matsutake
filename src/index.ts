import './preStart'; // must be first import
import 'reflect-metadata';
import connectDB from './database';
import logger from './shared/logger';
import app from './server';

const startServer = () => {
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    logger.info('Server listening on port 3000');
  });
};

(async () => {
  await connectDB();
  startServer();
})();
