import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Reimbursement } from "./Reimbursement";

@Entity()
export class ReimbursementEvidence {

	@PrimaryGeneratedColumn('uuid')
  id: string;

	@ManyToOne(() => Reimbursement, reimbursement => reimbursement.reimbursementEvidence)
	@JoinColumn({ name: 'reimbursementId' })
	reimbursement: Reimbursement;

	@Column({
	  type: 'varchar',
	  length: 200,
	})
	fileName: string;

	@Column({
	  type: 'varchar',
	  length: 200,
	})
	originalName: string;

	@Column({
	  type: 'varchar',
	  length: 200,
	})
	folderCode: string;

	@Column({
	  type: "decimal",
	  precision: 8,
	  scale: 0,
	  nullable: true,
	})
	fileSize: number;

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
	})
	lastUpdatedBy: string;

	@UpdateDateColumn({
	  nullable: true,
	})
	lastUpdatedDate: Date;

	@Column()
	activeFlag: boolean;



}