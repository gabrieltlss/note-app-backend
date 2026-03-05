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

    public async createUser(email: string): Promise<number | boolean> {
        const newUser = await userRepository.createUser(email);
        if (newUser) return false;
        return newUser;
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

    public async deleteNote(noteId: number): Promise<boolean> {
        const deleteResult = await userRepository.deleteNote(noteId);
        if (!deleteResult) return false;
        return true;
    }
}