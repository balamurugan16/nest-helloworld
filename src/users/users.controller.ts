import { AuthGuard } from './../guards/auth.guard';
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
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { Serialize } from './../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';

// @UseInterceptors(CurrentUserInterceptor) // this way is controller scoped. Applies to this controller only.
@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // async whoAmI(@Session() session: any) {
  //   const user = await this.usersService.findOneUserById(session.userId);
  //   if (!user) throw new ForbiddenException('You are not authenticated');
  //   return user;
  // }
  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  /*
  There are 2 cookie-session related headers: Cookie and Set-Cookie which contains an encrypted string as value
  Set-Cookie will be returned by the server to create a session for the user
  Cookie will be sent by the client which will be sent as a header to the server.
  */
  @Post('/signup')
  async createUser(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    /*
    here the session will be set and SetCookie will be returned as header to the client.
    */
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDTO, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    /*
    If the session is the same as before, then set-cookie header will not be sent back.
    */
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
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
