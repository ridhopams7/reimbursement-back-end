import { Entity, Column, PrimaryGeneratedColumn , CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';

@Entity()
export class UserApp {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  fullName: string;

  @Column()
  @MinLength(8)
  password: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  createdBy: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  lastUpdatedBy: string;

  @UpdateDateColumn({nullable: true})
  lastUpdatedDate: Date;
  
  @Column()
  activeFlag: boolean;

}