import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateDTO {
  @IsString()
  make: string;

  @IsString()
  model: string;

  // receives the exact property that the decorator is applied on if destructured
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({ value }) => parseInt(value))
  @IsLongitude()
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
