import { UserRepository } from "../repository/UserRepository";
import { Note } from "../types/Note";
import { User } from "../types/User";

const userRepository = new UserRepository();

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

    public async getNotesById(userId: number): Promise<Note[] | null> {
        const notes = await userRepository.getNotesById(userId);
        if (!notes) return null;
        return notes;
    }
}