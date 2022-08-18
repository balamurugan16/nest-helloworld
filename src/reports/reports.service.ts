import { CreateReportDTO } from './dtos/create-report.dto';
import { Report } from './reports.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

  async createReport(user: User, report: CreateReportDTO) {
    const createdReport = this.repo.create(report);
    createdReport.user = user;
    return this.repo.save(createdReport);
  }
}
