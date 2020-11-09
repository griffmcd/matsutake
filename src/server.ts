import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import routes from './routes';
import logger from './shared/logger';

const app = express();
const { BAD_REQUEST } = StatusCodes;

// basic express settings
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

app.use(bodyParser.json());
// add apis
// TODO: look at BaseRouter style routing in cheri-pi project
app.use('/', routes);

// Print API errors
// eslint-disable-next-line no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

export default app;
