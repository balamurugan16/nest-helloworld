import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { ServiceModule } from './service/service.module';
import { ControllerService } from './controller/controller.service';
import { ControllerModule } from './controller/controller.module';

@Module({
  imports: [UsersModule, ReportsModule, ServiceModule, ControllerModule],
  controllers: [AppController],
  providers: [AppService, ControllerService],
})
export class AppModule {}
