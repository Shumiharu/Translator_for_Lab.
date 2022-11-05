import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Member {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  token?: string;

  constructor(name: string, password: string, token: string) {
    this.name = name;
    this.password = password;
    this.token = token;
  }

}
