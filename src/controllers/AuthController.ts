import { validate } from 'class-validator';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import logger from '../shared/logger';
import config from '../config/config';
import User from '../entities/User';

class AuthController {
  static login = async (req: Request, res: Response) => {
    // check if username and password are set
    const { username, password } = req.body;
    logger.debug(`username: ${username}, pw: ${password}`);
    if (!(username && password)) {
      logger.warn('bad login request');
      res.status(StatusCodes.BAD_REQUEST).send();
    }

    // get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { username } });
      if (!user) {
        logger.warn('user not found');
        res.status(StatusCodes.UNAUTHORIZED).send();
      }
      // check if encrypted passwords match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        logger.warn('invalid password');
        res.status(401).send();
      }

      // sign JWT, valid for one hour
      logger.debug(`jwt secret: ${config.jwtSecret}`);
      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        config.jwtSecret,
        { expiresIn: '1h' },
      );
      // send the jwt in the response
      logger.debug(`sending token: ${token}`);
      res.setHeader('token', token);
      res.status(200)
        .cookie(config.cookieProps.key, token, { signed: true })
        .send();
    } catch (error) {
      logger.error(error.message);
      res.status(401).send();
    }
  };

  static changePassword = async (req: Request, res: Response) => {
    // get ID from JWT
    const id = res.locals.jwtPayload.userId;

    // get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    // get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
      // check if old password matches
      if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        res.status(401).send();
        return;
      }

      // validate the model (password length)
      user.password = newPassword;
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      // hash the new password and save
      user.hashPassword();
      userRepository.save(user);

      res.status(204).send();
    } catch (_error) {
      res.status(401).send();
    }
  }
}

export default AuthController;
