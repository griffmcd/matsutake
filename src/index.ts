import './preStart'; // must be first import
import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import routes from './routes';
import connectDB from './database';

const startServer = () => {
  // create express app
  const app = express();

  // middlewares
  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());

  app.use('/', routes);
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('Server started on port 3000!');
  });
};
(async () => {
  await connectDB();
  startServer();
})();
