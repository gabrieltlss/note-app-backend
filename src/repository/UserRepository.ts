import { IUserRepository } from "../types/IUserRepository";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise"
import { User } from "../types/User";
import { Note } from "../types/Note";

class UserRepository implements IUserRepository {
    constructor(private readonly pool: Pool) { }

    public async getUser(email: string): Promise<User | null> {
        const [rows] = await this.pool.execute<(User & RowDataPacket)[]>(
            "SELECT * FROM user WHERE email = ?",
            [email]
        );
        return rows[0] ?? null; // If undefined -> null.
    }

    public async createUser(email: string): Promise<number> {
        const [rows] = await this.pool.execute<ResultSetHeader>(
            "INSERT INTO user (email) VALUES (?);",
            [email]
        );
        return rows.insertId;
    }

    public async saveRefreshToken(userId: number, refreshToken: string): Promise<number> {
        const [rows] = await this.pool.execute<ResultSetHeader>(
            "INSERT INTO tokens VALUES (?, ?);",
            [userId, refreshToken]
        );
        return rows.affectedRows ?? false;
    }

    public async getUserById(id: number): Promise<Note[] | null> {
        const [rows] = await this.pool.execute<(Note & RowDataPacket)[]>("");
        return rows ?? null;
    }
}

export { UserRepository };