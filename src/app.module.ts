import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './users/user.entity';
// import { Report } from './reports/reports.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    /*
    ConfigService is a wrapper around dotenv package. 
    Multiple env files can be used provided the file is mentioned
    */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`, // NODE_ENV should be pointing to development or test
    }),
    /*
    to access the db name here, this approach is being used.
    useFactory will receive the class that is passed in the inject arrayt
    */
    TypeOrmModule.forRoot(),
    /*
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
          // used for database migration. True in development env only
          // the table structure will be changed by typeorm automatically if the schema is changed
          // in production, accidental deletion of a column will happen which is dangerous
        };
      },
    }),
    */
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Reports],
    //   synchronize: true, // used for database migration. True in development env only
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
/*
In nest, the order of execution when a request hits a server is
1. Middleware
2. Guard
3. Interceptor (it can execute before and after a request hits the controller) 
4. Controller
*/
