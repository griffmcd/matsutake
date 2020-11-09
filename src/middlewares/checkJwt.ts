import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  // get the jwt token from the head
  const token = <string>req.headers.auth;
  let jwtPayload;

  // try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET);
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    // if token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }

  // token is valid for 1 hour
  // we want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.setHeader('token', newToken);

  // call next middleware or controller
  next();
};

export default checkJwt;
