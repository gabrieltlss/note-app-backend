import { AppError } from "../errors/AppError";
import { UserRepository } from "../repository/UserRepository";
import { Note } from "../types/Note";
import { User } from "../types/User";

const userRepository = new UserRepository();

export class UserServices {
    public async getUserById(user_id: number): Promise<User> {
        try {
            const user = await userRepository.getUserById(user_id);
            if (!user) throw new AppError("UserNotFound", 404);
            return user;
        } catch (error) {
            throw new AppError("ServerError", 500);
        }
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

    public async deleteUser(userId: number): Promise<number> {
        try {
            const isUserDeleted = await userRepository.deleteUser(userId);
            if (!isUserDeleted) throw new AppError("UserNotFound", 404);
            return isUserDeleted;
        } catch (error) {
            throw new AppError("ServerError", 500);
        }
    }

    public async logout(userId: number): Promise<number> {
        try {
            const logoutUser = await userRepository.logout(userId);
            if (!logoutUser) throw new AppError("LogoutError", 400);
            return logoutUser;
        } catch (error) {
            throw new AppError("ServerError", 500);
        }
    }

    public async getNotesById(userId: number): Promise<Note[] | null> {
        try {
            const notes = await userRepository.getNotesById(userId);
            if (!notes) return null;
            return notes;
        } catch (error) {
            throw new AppError("ServerError", 500);
        }
    }

    public async createNote(userId: number, title: string, content: string): Promise<number | boolean> {
        try {
            const newNote = await userRepository.createNote(userId, title, content);
            if (!newNote) throw new AppError("CreateNoteError", 400);
            return newNote;
        } catch (error) {
            throw new AppError("ServerError", 500);
        }
    }

    public async deleteNote(userId: number, noteId: number): Promise<boolean> {
        try {
            const deleteResult = await userRepository.deleteNote(userId, noteId);
            if (!deleteResult) throw new AppError("NoteNotFound", 404);
            return true;
        } catch (error) {
            throw new AppError("ServerError", 500);
        }
    }

    public async updateNote(noteId: number, title: string, content: string, status: "active" | "archived"): Promise<boolean> {
        try {
            const updateResult = await userRepository.updateNote(noteId, title, content, status);
            if (!updateResult) throw new AppError("NoteNotUpdated", 400);
            return true;
        } catch (error) {
            throw new AppError("ServerError", 500);
        }
    }
}