import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcryptjs';

export interface IUser {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
@Entity()
@Unique(['username'])
class User implements IUser {
    @PrimaryGeneratedColumn()
  id!: number;

    @Column()
    @Length(4, 20)
    username: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 12);
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    constructor(
      usernameOrUser?: string | IUser,
      password?: string,
      role?: string,
      createdAt?: Date,
      updatedAt?: Date,
    ) {
      if (typeof usernameOrUser === 'string' || typeof usernameOrUser === 'undefined') {
        this.username = usernameOrUser || '';
        this.password = password || '';
        this.role = role || 'USER';
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
      } else {
        this.username = usernameOrUser.username;
        this.password = usernameOrUser.password;
        this.role = usernameOrUser.role;
        this.createdAt = usernameOrUser.createdAt;
        this.updatedAt = usernameOrUser.updatedAt;
      }
    }
}

export default User;
