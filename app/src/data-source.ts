import "reflect-metadata"
import { DataSource } from "typeorm"
import { Member } from "./entity/Member.js"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "dzzv8280",
    database: "okamotolab",
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [Member],
    migrations: [],
    subscribers: [],
})
