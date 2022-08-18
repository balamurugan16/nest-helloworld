import { ReportDTO } from './dtos/report.dto';
import { ReportsService } from './reports.service';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDTO } from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDTO } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDTO) {
    return this.reportsService.getEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDTO)
  createReport(@CurrentUser() user: User, @Body() body: CreateReportDTO) {
    return this.reportsService.createReport(user, body);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  async approveReport(@Param('id') id: string, @Body() body: ApproveReportDTO) {
    const report = await this.reportsService.approveReport(
      +id,
      body.isApproved,
    );
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }
}
