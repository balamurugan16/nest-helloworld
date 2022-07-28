import { AuthService } from './auth.service';
import { UserDTO } from './dtos/user.dto';
import { Serialize } from './../interceptors/serialize.interceptor';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDTO) {
    this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('all-users')
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  // @UseInterceptors(new SerializeInterceptor(UserDTO))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    // console.log('During running');
    const user = await this.usersService.findOneUserById(+id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  findAllUsersByEmail(@Query('email') email: string) {
    return this.usersService.findAllUsersByEmail(email);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDTO) {
    const updatedUser = await this.usersService.updateUser(+id, user);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deletedUser = await this.usersService.removeUser(parseInt(id));

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return deletedUser;
  }
}
