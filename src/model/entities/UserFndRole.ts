import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { FndRole } from "./FndRole";

@Entity()
export class UserFndRole {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({
    length: 50,
    nullable: false,
  })
  permission: string;

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

  // @ManyToOne(() => User, (user) => user.userFndRoles)
  // user: User;

  @ManyToOne(() => FndRole, (fndRole) => fndRole.userFndRoles)
  fndRole: FndRole;
}