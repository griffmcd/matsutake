import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import path from 'path';
import cookieParser from 'cookie-parser';
import BaseRouter from './routes';
import logger from './shared/logger';
import config from './config/config';

const app = express();
const { BAD_REQUEST } = StatusCodes;

/*
 * basic express settings
 */

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.cookieProps.secret));

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
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  return res.status(BAD_REQUEST).json({
    error: err.message,
  });
});

/**
 * serve front end content
 */

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

app.get('/', (req: Request, res: Response) => {
  res.sendFile('login.html', { root: viewsDir });
});

app.get('/users', (req: Request, res: Response) => {
  const { signedCookies } = req;
  logger.info('f');
  if (signedCookies === undefined) {
    res.redirect('/');
  }
  const jwt = req.signedCookies[config.cookieProps.key];
  if (!jwt) {
    res.redirect('/');
  } else {
    res.sendFile('users.html', { root: viewsDir });
  }
});

/**
 * export server
 */

export default app;
