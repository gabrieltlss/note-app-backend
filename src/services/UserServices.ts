import { getPool } from "../models/database";
import { UserRepository } from "../repository/UserRepository";
import { Note } from "../types/Note";
import { User } from "../types/User";

const pool = getPool();
const userRepository = new UserRepository(pool);

export class UserServices {
    public async getUser(email: string): Promise<User | false> {
        const user = await userRepository.getUser(email);
        if (!user) return false;
        return user;
    }

    public async createUser(email: string): Promise<number> {
        const newUser = await userRepository.createUser(email);
        return newUser;
    }

    public async getNoteById(id: number): Promise<Note[] | null> {
        const newUser = await userRepository.getUserById(id);
        return newUser;
    }

}