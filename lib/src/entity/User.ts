import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
// import { PrimaryGeneratedColumn, Column} from "typeorm";
// import { Entity } from "../../lib/Entity";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string
}
