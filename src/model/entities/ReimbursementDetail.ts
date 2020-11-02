import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Reimbursement } from "./Reimbursement";

@Entity()
export class ReimbursementDetail {

	@PrimaryGeneratedColumn('uuid')
    Id: string;

	@ManyToOne(() => Reimbursement, reimbursement => reimbursement.reimbursementDetail)
	@JoinColumn({ name: 'reimbursementId' })
	reimbursement: Reimbursement;

	@Column()
	lineNo: number;

	@Column({
	  type: 'varchar',
	  length: 300,
	  nullable: true,
	})
	description: string;

	@Column({
	  type: 'varchar',
	  length: 50,
	  nullable: true,
	})
	transactionId: string;

	@Column({
	  type: 'varchar',
	  length: 50,
	})
	transactionCode: string;

	@Column({
	  type: 'varchar',
	  length: 100,
	})
	transactionName: string;

	@Column({ type: "decimal", precision: 24, scale: 4, nullable: true })
	amount: number;

    @Column({
	  type: 'varchar',
	  length: 100,
	  nullable: true,
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

	@UpdateDateColumn({
	  nullable: true,
	})
	lastUpdatedDate: Date;

	@Column({
	  nullable: true,
	})
	activeFlag: boolean;

}