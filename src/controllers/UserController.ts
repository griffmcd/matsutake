import { Request, Response } from 'express';
import { FindOneOptions, getRepository } from 'typeorm';
import { validate } from 'class-validator';
import User from '../entities/User';

class UserController {
    static listAll = async (req: Request, res: Response) => {
      // get users from db
      const userRepository = getRepository(User);
      const users = await userRepository.find({
        select: ['id', 'username', 'role'], // we don't want to send the passwords on response
      });

      // send the users object
      res.send(users);
    };

    static getOneById = async (req: Request, res: Response) => {
      // get the ID from the url
      const { id } = req.params;

      // get the user from the database
      const userRepository = getRepository(User);
      let user: User;
      try {
        user = await userRepository.findOneOrFail(id, {
          select: ['id', 'username', 'role'],
        } as FindOneOptions);
        return user;
      } catch (error) {
        res.status(404).send('User not found');
      }
      return undefined;
    };

    static newUser = async (req: Request, res: Response) => {
      // get parameters from the body
      const { username, password, role } = req.body;
      const user = new User();
      user.username = username;
      user.password = password;
      user.role = role;

      // validate if the parameters are ok
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      // has the password for storage in db
      user.hashPassword();

      // try to save. if fails, username is already in use.
      const userRepository = getRepository(User);
      try {
        await userRepository.save(user);
      } catch (error) {
        res.status(409).send('username already in use');
        return;
      }

      // if all ok, send 201 response
      res.status(201).send('User created');
    };

    static editUser = async (req: Request, res: Response) => {
      // get the ID from the url
      const { id } = req.params;

      // get the values from the body
      const { username, role } = req.body;

      // try to find user on database
      const userRepository = getRepository(User);
      let user;
      try {
        user = await userRepository.findOneOrFail(id);
      } catch (error) {
        res.status(404).send('User not found');
        return;
      }

      // validate the new values on the model
      user.username = username;
      user.role = role;
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }

      // try to save. if fails, username already in use
      try {
        await userRepository.save(user);
      } catch (error) {
        res.status(409).send('username already in use');
        return;
      }

      res.status(204).send();
    }

    static deleteUser = async (req: Request, res: Response) => {
      // get id from url
      const { id } = req.params;

      const userRepository = getRepository(User);
      try {
        await userRepository.findOneOrFail(id);
      } catch (error) {
        res.status(404).send('User not found');
        return;
      }
      userRepository.delete(id);
      res.status(204).send();
    };
}

export default UserController;
