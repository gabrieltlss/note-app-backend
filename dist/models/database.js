"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = getClient;
exports.getPool = getPool;
const promise_1 = __importDefault(require("mysql2/promise"));
// import dotenv from "dotenv";
// dotenv.config();
const connectionData = {
    user: String(process.env.DB_USER),
    password: String(process.env.DB_PASSWORD),
    database: String(process.env.DB_DATABASE),
};
function getClient() {
    const client = promise_1.default.createConnection(connectionData);
    return client;
}
function getPool() {
    const pool = promise_1.default.createPool(connectionData);
    return pool;
}
