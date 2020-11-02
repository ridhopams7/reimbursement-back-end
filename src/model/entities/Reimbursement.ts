import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
// import { Organization } from "./Organization";
import { ReimbursementEvidence } from "./ReimbursementEvidence";
import { ReimbursementDetail } from "./ReimbursementDetail";

@Entity()
export class Reimbursement {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  code: string;

  @Column({
    type: 'varchar',
    length:50,
    nullable: true,
  })
  accountingPeriodId: string;

  @Column({
    type: 'varchar',
    length:50,
  })
  accountingPeriodCode: string;
 
  @Column({
    type: 'varchar',
    length:50,
    nullable: true,
  })
  clientId: string;

  @Column({
    type: 'varchar',
    length:50,
    nullable: true,
  })
  clientCode: string;

  @Column({
    type: 'varchar',
    length:100,
    nullable: true,
  })
  clientName: string;
  
  @Column({
    type: 'varchar',
    length:50,
    nullable: true,
  })
  projectId: string;

  @Column({
    type: 'varchar',
    length:50,
    nullable: true,
  })
  projectCode: string;

  @Column({
    type: 'varchar',
    length:100,
    nullable: true,
  })
  projectName: string;

  @Column({
    type: 'varchar',
    length:50,
    nullable: true,
  })
  picId: string;

  @Column({
    type: 'varchar',
    length:100,
    nullable: true,
  })
  picName: string;

  @Column({ type: "decimal", precision: 24, scale: 4, nullable: true })
  actualAmount: number;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  status: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  approvedBy: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  rejectedBy: string;

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

  @OneToMany(() => ReimbursementDetail, reimbursementDetail => reimbursementDetail.reimbursement)
  reimbursementDetail: ReimbursementDetail[];

  @OneToMany(() => ReimbursementEvidence, reimbursementEvidence => reimbursementEvidence.reimbursement)
  reimbursementEvidence: ReimbursementEvidence[];
}