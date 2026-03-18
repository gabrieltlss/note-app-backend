"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = require("../models/database");
const pool = (0, database_1.getPool)();
class UserRepository {
    constructor() { }
    async getUserByEmail(email) {
        const [rows] = await pool.execute("SELECT * FROM user WHERE email = ?", [email]);
        return rows[0] ?? null; // If undefined -> null.
    }
    async getUserById(userId) {
        const [rows] = await pool.execute("SELECT * FROM user WHERE id = ?", [userId]);
        return rows[0] ?? null;
    }
    async createUser(email) {
        const [rows] = await pool.execute("INSERT INTO user (email) VALUES (?);", [email]);
        return rows.insertId ?? null;
    }
    async deleteUser(userId) {
        const [rows] = await pool.execute("DELETE FROM user WHERE id = ?;", [userId]);
        return rows.affectedRows ?? null;
    }
    async logout(userId) {
        const [rows] = await pool.execute("UPDATE tokens SET token = null WHERE user_id = ?;", [userId]);
        return rows.affectedRows ?? null;
    }
    async getRefreshTokenById(tokenId) {
        const [rows] = await pool.execute("SELECT * FROM tokens WHERE token_id = ?", [tokenId]);
        return rows[0] ?? null; // If undefined -> null.
    }
    async getRefreshTokenByUser(userId) {
        const [rows] = await pool.execute("SELECT * FROM tokens WHERE user_id = ?", [userId]);
        return rows[0] ?? null;
    }
    async saveRefreshToken(userId, refreshToken) {
        const [rows] = await pool.execute("INSERT INTO tokens (user_id, token) VALUES (?, ?);", [userId, refreshToken]);
        return rows.insertId ?? false;
    }
    async updateRefreshToken(userId, token) {
        const [rows] = await pool.execute("UPDATE tokens SET token = ? WHERE user_id = ?;", [token, userId]);
        return rows.affectedRows ?? false;
    }
    async removeRefreshToken(tokenId) {
        const [rows] = await pool.execute("DELETE FROM tokens WHERE token_id = ?", [tokenId]);
        return rows.affectedRows ? true : false;
    }
    async getNotesById(userId) {
        const [rows] = await pool.execute("SELECT * FROM notes WHERE user_id = ?", [userId]);
        return rows ?? null;
    }
    async createNote(userId, title, content) {
        const [rows] = await pool.execute("INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?);", [userId, title, content]);
        return rows.insertId ?? null;
    }
    async deleteNote(userId, noteId) {
        const [rows] = await pool.execute("DELETE FROM notes WHERE note_id = ? AND user_id = ?", [noteId, userId]);
        return rows.affectedRows ? true : false;
    }
    async updateNote(noteId, title, content, status) {
        const [rows] = await pool.execute("UPDATE notes SET title = ?, content = ?, status = ? WHERE note_id = ?", [title, content, status, noteId]);
        return rows.affectedRows ? true : false;
    }
}
exports.UserRepository = UserRepository;
