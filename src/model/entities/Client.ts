import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { ClientProject } from "./ClientProject";

@Entity()
export class Client {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: 'varchar',
    length: 5,
  })
  code: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;
  
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
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

  @OneToMany(() => ClientProject, clientProject => clientProject.client)
  clientProject: ClientProject[];

}