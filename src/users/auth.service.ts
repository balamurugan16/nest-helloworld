import { UsersService } from './users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

// scrypt works on callbacks, here the package is converted to promises.
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // see if email is in use
    const users = await this.userService.findAllUsersByEmail(email);

    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    /*     
     hash the user password
     converts a string to a digital input (irreversible)
     should avoid rainbow table attack
     */

    // generate  a salt
    const salt = randomBytes(8).toString('hex');

    // hash the password
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join hash and salt together
    const result = `${salt}.${hash.toString('hex')}`;

    // create a new user and save it
    const user = await this.userService.createUser(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.findAllUsersByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex'))
      throw new BadRequestException('Bad User credentials');

    return user;
  }
}
