import { Report } from './../reports/reports.entity';
// import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // Exclude can be used to omit a property when returned by a controller
  // @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  /**
   * lifecycle hooks in TypeOrm
   * These hooks will only run when the entity instance is created using the create() method of repository
   */
  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ' + this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id: ' + this.id);
  }
  @AfterRemove()
  logDelete() {
    console.log('Removed user with id: ' + this.id);
  }
}
