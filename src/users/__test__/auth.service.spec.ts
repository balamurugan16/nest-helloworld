import { User } from '../user.entity';
import { UsersService } from '../users.service';
import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create fake user service
    /*
    the auth service uses only findAllUsersByEmail and createUser method from
    the UsersService so it is sufficient that those methods are mocked right here.
    Add strong types so that the fake user service is not messes up even when the return types are changed.
    */
    const users: User[] = [];
    fakeUsersService = {
      findAllUsersByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      createUser: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // if UsersService is needed, use fakeUsersService value.
        // that is what the below mentioned object signifies.
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  /*
    here the signup method of AuthService is tested
    Checks whether the given user and the returned user is not equal which implies the salting process works
  */
  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  /*
  This tests if the given user already exists inside the database.
  here the moch findAllUsersByEmail method is changed so that it returns one user to test this condition
  */

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('asdf@asdf.com', 'asdf');
    // expects to throw BadRequestException
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow();
  });

  it('throws an error if user attempts to sign in with email that is not available in db', async () => {
    await expect(service.signin('asdf@gmail.com', 'asdf')).rejects.toThrow();
  });
});
