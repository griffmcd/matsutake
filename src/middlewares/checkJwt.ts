import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import logger from '../shared/logger';

const extractTokenFromCookie = (data: string): string => {
  const tagRemoved = data.split('=')[1];
  const splitParts = tagRemoved.split('.');
  const token = `${splitParts[0].substring(4)}.${splitParts[1]}.${splitParts[2]}`;
  return token;
};

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // get the jwt token from the head
  logger.info('extracting token from cookie');
  const cookieStr = <string>req.headers.cookie;
  const token = extractTokenFromCookie(cookieStr);
  let jwtPayload;

  // try to validate the token and get data
  logger.info('attempting to validate jwt token');
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // if token is not valid, respond with 401 (unauthorized)
    logger.error(error.message);
    res.status(401).send();
    return;
  }

  // token is valid for 1 hour
  // we want to send a new token on every request
  logger.info('generating new jwt token');
  const { userId, username, role } = jwtPayload;
  const newToken = jwt.sign(
    { userId, username, role },
    config.jwtSecret,
    { expiresIn: '1h' },
  );
  res.setHeader('token', newToken);
  res.cookie(config.cookieProps.key, token, { signed: true });

  // call next middleware or controller
  next();
};

export default checkJwt;
