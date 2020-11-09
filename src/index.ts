import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import routes from './routes';

createConnection()
  // eslint-disable-next-line no-unused-vars
  .then(async (_connection) => {
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
  })
  // eslint-disable-next-line no-console
  .catch((error) => console.log(error));
