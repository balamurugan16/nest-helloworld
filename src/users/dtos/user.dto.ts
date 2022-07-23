import { Expose } from 'class-transformer';

// default way of exposing User outside the app
export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
