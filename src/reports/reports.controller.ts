import { ReportDTO } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) { }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(@CurrentUser() user: User, @Body() body: CreateReportDTO) {
    return this.reportsService.createReport(user, body);
  }
}
