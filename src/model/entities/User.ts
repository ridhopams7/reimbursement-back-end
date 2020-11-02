import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { UserFndRole } from "./UserFndRole";


@Entity()
export class User {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @MinLength(8)
  password: string;

  @Column()
  isActive: boolean;

  @OneToMany(() => UserFndRole, userFndRole => userFndRole.fndRole)
  userFndRoles: UserFndRole[];

}