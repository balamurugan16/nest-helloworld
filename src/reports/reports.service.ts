import { CreateReportDTO } from './dtos/create-report.dto';
import { Report } from './reports.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { GetEstimateDTO } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  getEstimate({ make, model, lat, lng, year, mileage }: GetEstimateDTO) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', {
        // :make is a placeholder that will be inserted from the object
        make,
      })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('isApproved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  async createReport(user: User, report: CreateReportDTO) {
    const createdReport = this.repo.create(report);
    createdReport.user = user;
    return this.repo.save(createdReport);
  }

  async approveReport(id: number, isApproved: boolean) {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) return null;
    report.isApproved = isApproved;
    return this.repo.save(report);
  }
}
