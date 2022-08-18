import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  // to avoid circular dependency the arguments are provided in the ManyToOne decorator
  // first arg => only when the User entity is defined, it will be related here
  // second arg is typeorm specific, it tells which property it is associated with in the related entity
  @ManyToOne(() => User, (user) => user.reports) // makes a change to the table (user_id column is added)
  user: User;
}
