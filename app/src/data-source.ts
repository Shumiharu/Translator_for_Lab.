import "reflect-metadata"
import dotenv from 'dotenv'
import { DataSource } from "typeorm"
import { Member } from "./entity/Member.js"

if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: process.env.HOST || "translator_db",
    port: Number(process.env.PORT_DB) || 3307,
    username: process.env.name || "root",
    password: process.env.password || "dzzv8280",
    database: process.env.DB || "okamotolab",
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [Member],
    migrations: [],
    subscribers: [],
})
