/* eslint-disable class-methods-use-this */
import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import User from '../entities/User';

class CreateAdminUser1604898130767 implements MigrationInterface {
  // eslint-disable-next-line no-unused-vars
  public async up(_queryRunner: QueryRunner): Promise<any> {
    const user = new User();
    user.username = 'admin';
    user.password = 'admin';
    user.hashPassword();
    user.role = 'ADMIN';
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  // eslint-disable-next-line no-unused-vars, no-empty-function
  public async down(_queryRunner: QueryRunner): Promise<any> {
  }
}

export default CreateAdminUser1604898130767;
