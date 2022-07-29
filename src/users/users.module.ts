import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentUserInterceptor } from './../interceptors/current-user.interceptor';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  /* 
  here all the libraries related configs are imported
  for example, typeorm, configmodule, cache module.
  Other than that, other custom modules can be imported, the exported classses will be available here in this module
  */
  imports: [TypeOrmModule.forFeature([User])],

  /*
  here all the different controllers associated with this module will be listed here
  */
  controllers: [UsersController],
  /*
  here, the services, repositories and interceptors that are required to be provided by the DI container should come.
  custom providers can also be provided here in this format
  {
    provide: <Class>
    useValue / useFactory: The value that to be used when this class is provided.
  }
  */
  providers: [
    UsersService,
    AuthService,
    // CurrentUserInterceptor, // this will provide the interceptor to the classes in module
    // the below approach will add the CurrentUserInterceptor globally to every controllers.
    // here the APP_INTERCEPTOR is provided
    // and when needed the value of CurrentUserInterceptor will be provided in this place
    // downside is for controllers which doesn't need this interceptor, still this interceptor will be applied
    // this is a overfetching issue.
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
  ],
})
export class UsersModule {}
