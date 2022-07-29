import { User } from './../user.entity';
import { AuthService } from './../auth.service';
import { UsersService } from './../users.service';
import { UsersController } from './../users.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneUserById: (id: number) =>
        Promise.resolve({ id, email: 'asdasd', password: 'sadsd' } as User),
      // removeUser: (id: number) => Promise.resolve({id, email: "asdasd", password: "sadsd"} as User),
      // updateUser: () => Promise.resolve({id, email: "asdasd", password: "sadsd"} as User),
      findAllUsersByEmail: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'sadsd' } as User]),
    };

    fakeAuthService = {
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
      // signup: () => {}
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = app.get<UsersController>(UsersController);
  });

  it('should be defined"', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers should return a list of users with the same email id', async () => {
    const users = await controller.findAllUsersByEmail('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findallusers throws exception when given id is not found', async () => {
    fakeUsersService.findOneUserById = () => null;
    await expect(controller.findUser('1')).rejects.toThrow();
  });

  it('should sign in and update session object and return user', async () => {
    const session = { userId: -1 };
    const user = await controller.signin(
      { email: 'asdsada', password: 'adasd' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
