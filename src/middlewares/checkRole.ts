import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../entities/User';

const checkRole = (roles: Array<string>) => async (
  _req: Request, res: Response, next: NextFunction,
) => {
  // get the user id from previous middleware
  const id = res.locals.jwtPayload.userId;

  // get user role from the database
  const userRepository = getRepository(User);
  let user: User;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (_error) {
    res.status(401).send();
  }

  // check if array of authorized roles includes the user's role
  if (roles.indexOf(user.role) > -1) {
    next();
  } else {
    res.status(401).send();
  }
};

export default checkRole;
