import { UserRepository } from "../repository/UserRepository";
import { Note } from "../types/Note";
import { User } from "../types/User";

const userRepository = new UserRepository();

export class UserServices {
    public async getUserById(user_id: number): Promise<User | false> {
        const user = await userRepository.getUserById(user_id);
        if (!user) return false;
        return user;
    }
    public async getUserByEmail(email: string): Promise<User | false> {
        const user = await userRepository.getUserByEmail(email);
        if (!user) return false;
        return user;
    }

    public async createUser(email: string): Promise<number | boolean> {
        const newUser = await userRepository.createUser(email);
        if (!newUser) return false;
        return newUser;
    }

    public async deleteUser(userId: number): Promise<number | null> {
        const isUserDeleted = await userRepository.deleteUser(userId);
        if (!isUserDeleted) return null;
        return isUserDeleted;
    }

    public async getNotesById(userId: number): Promise<Note[] | null> {
        const notes = await userRepository.getNotesById(userId);
        if (!notes) return null;
        return notes;
    }

    public async createNote(userId: number, title: string, content: string): Promise<number | boolean> {
        const newNote = await userRepository.createNote(userId, title, content);
        if (!newNote) return false;
        return newNote;
    }

    public async deleteNote(userId: number, noteId: number): Promise<boolean> {
        const deleteResult = await userRepository.deleteNote(userId, noteId);
        if (!deleteResult) return false;
        return true;
    }

    public async updateNote(noteId: number, title: string, content: string, status: "active" | "archived"): Promise<boolean> {
        const updateResult = await userRepository.updateNote(noteId, title, content, status);
        if (!updateResult) return false;
        return true;
    }
}