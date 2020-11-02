import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FndRole } from "./FndRole";

@Entity()
export class RoleMenu {

  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({
    length: 100,
    nullable: false,
  })
  menuId: string;

  @Column({
    length: 100,
    nullable: false,
  })
  roleId: string;

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

//   @ManyToOne(() => User, (user) => user.userFndRoles)
//   user: User;
}