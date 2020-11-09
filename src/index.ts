import './preStart'; // must be first import
import 'reflect-metadata';
import connectDB from './database';
import logger from './shared/logger';
import app from './server';

const port = process.env.PORT || 3000;
const startServer = () => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    logger.info(`Server listening on port ${port}`);
  });
};

(async () => {
  await connectDB();
  startServer();
})();
