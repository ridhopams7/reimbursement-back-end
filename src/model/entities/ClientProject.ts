import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Client } from "./Client";

@Entity()
export class ClientProject {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Client, client => client.clientProject)
    @JoinColumn({ name: 'clientId' })
    client: Client;

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

    @UpdateDateColumn({ nullable: true })
    lastUpdatedDate: Date;

    @Column()
    activeFlag: boolean;

}