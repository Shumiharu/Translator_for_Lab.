import "reflect-metadata"
import { DataSource } from "typeorm"
import * as fs from 'fs'
import { Member } from "../entity/Member.js"

const database_txt = fs.readFileSync("/run/secrets/db_settings").toString();
const database = JSON.parse(database_txt);

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: database.host,
    port: 3306,
    username: database.user,
    password: database.password,
    database: database.name,
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [Member],
    migrations: [],
    subscribers: [],
})


