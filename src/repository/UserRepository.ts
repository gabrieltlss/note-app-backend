import { IUserRepository } from "../types/IUserRepository";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise"
import { User } from "../types/User";
import { Note } from "../types/Note";
import { Token } from "../types/Token";
import { getPool } from "../models/database";

const pool = getPool();

class UserRepository implements IUserRepository {
    constructor() { }

    public async getUser(email: string): Promise<User | null> {
        const [rows] = await pool.execute<(User & RowDataPacket)[]>(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );
        return rows[0] ?? null; // If undefined -> null.
    }

    public async createUser(email: string): Promise<number> {
        const [rows] = await pool.execute<ResultSetHeader>(
            "INSERT INTO user (email) VALUES (?);",
            [email]
        );
        return rows.insertId ?? null;
    }

    public async getRefreshTokenById(tokenId: number): Promise<Token | null> {
        const [rows] = await pool.execute<(Token & RowDataPacket)[]>(
            "SELECT * FROM tokens WHERE token_id = ?", [tokenId]
        );
        return rows[0] ?? null; // If undefined -> null.
    }

    public async getRefreshTokenByUser(userId: number): Promise<Token | null> {
        const [rows] = await pool.execute<(Token & RowDataPacket)[]>(
            "SELECT * FROM tokens WHERE user_id = ?", [userId]
        );
        return rows[0] ?? null;
    }

    public async saveRefreshToken(userId: number, refreshToken: string): Promise<number> {
        const [rows] = await pool.execute<ResultSetHeader>(
            "INSERT INTO tokens (user_id, token) VALUES (?, ?);",
            [userId, refreshToken]
        );
        return rows.insertId ?? false;
    }

    public async updateRefreshToken(userId: number, token: string): Promise<number> {
        const [rows] = await pool.execute<ResultSetHeader>(
            "UPDATE tokens SET token = ? WHERE user_id = ?;",
            [token, userId]
        );
        return rows.affectedRows ?? false;
    }

    public async removeRefreshToken(tokenId: number): Promise<boolean> {
        const [rows] = await pool.execute<ResultSetHeader>(
            "DELETE FROM tokens WHERE token_id = ?",
            [tokenId]
        );
        return rows.affectedRows ? true : false;
    }

    public async getNotesById(userId: number): Promise<Note[] | null> {
        const [rows] = await pool.execute<(Note & RowDataPacket)[]>(
            "SELECT * FROM notes WHERE user_id = ?",
            [userId]
        );
        return rows ?? null;
    }

    public async createNote(userId: number, title: string, content: string): Promise<number> {
        const [rows] = await pool.execute<ResultSetHeader>(
            "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?);",
            [userId, title, content]
        );
        return rows.insertId ?? null;
    }

    public async deleteNote(userId: number, noteId: number): Promise<boolean> {
        const [rows] = await pool.execute<ResultSetHeader>(
            "DELETE FROM notes WHERE note_id = ? AND user_id = ?",
            [noteId, userId]
        );
        return rows.affectedRows ? true : false;
    }
}

export { UserRepository };