import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connectionData = {
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE),
    port: Number(process.env.PORT),
    host: String(process.env.HOST)
}

function getClient(): Promise<mysql2.Connection> {
    const client = mysql2.createConnection(connectionData);
    return client;
}

function getPool(): mysql2.Pool {
    const pool = mysql2.createPool(connectionData);
    return pool;
}

export { getClient, getPool }