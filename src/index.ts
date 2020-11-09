import './preStart'; // must be first import
import 'reflect-metadata';
import express from 'express';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import connectDB from './database';
import logger from './shared/logger';

const startServer = () => {
  // create express app
  const app = express();

  // logger
  // eslint-disable-next-line global-require
  app.use(require('morgan')('combined', { stream: logger.stream }));

  // middlewares
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());

  app.use('/', routes);
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    logger.info('Server listening on port 3000');
  });
};
(async () => {
  await connectDB();
  startServer();
})();
