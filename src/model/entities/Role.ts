import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { MinLength } from 'class-validator';
// import { UserFndRole } from "./UserFndRole";

@Entity()
export class Role {


  @PrimaryColumn({
    unique: true,
    length: 50,
  })
  roleId: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  roleDesc: string;

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

//   @OneToMany(() => UserFndRole, userFndRole => userFndRole.fndRole)
//   userFndRoles: UserFndRole[];
}