import { getPool } from "../models/database";
import { UserRepository } from "../repository/UserRepository";
import { Note } from "../types/Note";
import { User } from "../types/User";
import jwt from "jsonwebtoken";

const pool = getPool();
const userRepository = new UserRepository(pool);

export class UserServices {
    public async getUser(email: string): Promise<User | false> {
        const user = await userRepository.getUser(email);
        if (!user) return false;
        return user;
    }

    public async createUser(email: string): Promise<number> {
        // Mudar aqui: fazer cheacagem e retornar boolean como em saveRefreshTokens?
        const newUser = await userRepository.createUser(email);
        return newUser;
    }

    public generateAccessToken(payload: object): string {
        const accessToken = jwt.sign(
            payload,
            String(process.env.JWT_ACCESS_SECRET),
            { expiresIn: "5s" }
        );
        return accessToken;
    }

    public generateRefreshToken(): string {
        // Finalizar
        return ""
    }

    public async saveRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
        const newToken = await userRepository.saveRefreshToken(userId, refreshToken);
        if (!newToken) { return false; }
        return true;
    }

    public async getNoteById(id: number): Promise<Note[] | null> {
        const newUser = await userRepository.getUserById(id);
        return newUser;
    }
}