import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Master {

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
    nullable: true,
  })
  description: string;
  
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

}