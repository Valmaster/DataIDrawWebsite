import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import { Role } from './enums/roles.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({default: Role.USER})
    role: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    email_confirmed_at?: Date;
}