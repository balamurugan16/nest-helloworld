import { Expose, Transform } from 'class-transformer';

export class ReportDTO {
  @Expose()
  id: number;
  @Expose()
  price: number;
  @Expose()
  year: number;
  @Expose()
  lng: number;
  @Expose()
  make: number;
  @Expose()
  model: string;
  @Expose()
  mileage: number;

  /*
  here when the reports is returned as it is, the associated user object is also exposed with password
  this is not appreciated
  the Transform decorator is used to create a new property out of the existing return value
  the obj is the Reports object that this DTO is currently handling.
  a new property userId which is actually not a part of Reports entity is created and the value is
  destructured from the Reports entity.
  */
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
