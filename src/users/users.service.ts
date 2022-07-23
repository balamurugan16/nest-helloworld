import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) // this decorator is used since dependency injection works stale in Generic types
    private userRepo: Repository<User>,
  ) {}

  createUser(email: string, password: string) {
    const user = this.userRepo.create({ email, password }); // creates an instance of user
    /**
     * after creating an instance, any validations or business logic can be
     * executed before persisting to the database.
     * Also the lifecycle hooks in entity class will be executed only when the instance is created.
     * -----
     * But still just passing the data to the save method will eventually work
     * without able to execute the hooks or any other validations
     */
    return this.userRepo.save(user); // saves the instance to the database
  }

  findOneUserById(id: number) {
    // can find entities with any properties that it has
    // to search by id, just passing id is enough
    // to search by other properties, { property: "value" } format should be passed
    // returns the first found entity
    return this.userRepo.findOne({
      where: {
        id,
      },
    });
  }

  findAllUsersByEmail(email: string) {
    return this.userRepo.find({
      where: {
        email,
      },
    });
  }

  findAllUsers() {
    return this.userRepo.find();
  }

  /**
   * Partial is an inbuilt typescript feature that can accept a type which has some of the defined properties alone
   * Eg: if only email is sent for User, Partial will accept it.
   */
  async updateUser(id: number, attrs: Partial<User>) {
    const user = await this.findOneUserById(id);
    if (!user) {
      /**
       * throwing HttpExceptions in service may lead to reduce the reusability if
       * the controllers are written for web sockets or gRPC services.
       * Usage of Exception filters is appreciated.
       */
      // throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      return user;
    }
    Object.assign(user, attrs); // assigns properties of attrs to user (overrides if needed)
    return this.userRepo.save(user);
  }

  async removeUser(id: number) {
    const user = await this.findOneUserById(id);
    if (!user) {
      // throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      return null;
    }
    return this.userRepo.remove(user);
  }
}
