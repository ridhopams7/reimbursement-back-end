import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MasterDetail {

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
    value: string;

    @Column({
      type: 'varchar',
      length: 100,
      nullable: true,
    })
    description: string;

    @Column({
      nullable: true,
    })
    sort: number;

    @Column({
      type: 'varchar',
      length: 50,
      nullable: true,
    })
    masterId: string;

    @Column({
      type: 'varchar',
      length: 50,
      nullable: true,
    })
    masterCode: string;

    @Column({
      type: 'varchar',
      length: 100,
      nullable: true,
    })
    masterName: string;

    @Column({
      type: 'varchar',
      length: 50,
      nullable: true,
    })
    parentId: string;

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

    @UpdateDateColumn({ nullable: true })
    lastUpdatedDate: Date;

    @Column()
    activeFlag: boolean;

}