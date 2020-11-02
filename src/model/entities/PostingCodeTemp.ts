import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class PostingCodeTemp {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  sequence: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  period: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type: string;
  
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