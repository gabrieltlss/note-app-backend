"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const AppError_1 = require("../errors/AppError");
const UserRepository_1 = require("../repository/UserRepository");
const userRepository = new UserRepository_1.UserRepository();
class UserServices {
    async getUserById(user_id) {
        try {
            const user = await userRepository.getUserById(user_id);
            if (!user)
                throw new AppError_1.AppError("UserNotFound", 404);
            return user;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async getUserByEmail(email) {
        const user = await userRepository.getUserByEmail(email);
        if (!user)
            return false;
        return user;
    }
    async createUser(email) {
        const newUser = await userRepository.createUser(email);
        if (!newUser)
            return false;
        return newUser;
    }
    async deleteUser(userId) {
        try {
            const isUserDeleted = await userRepository.deleteUser(userId);
            if (!isUserDeleted)
                throw new AppError_1.AppError("UserNotFound", 404);
            return isUserDeleted;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async logout(userId) {
        try {
            const logoutUser = await userRepository.logout(userId);
            if (!logoutUser)
                throw new AppError_1.AppError("LogoutError", 400);
            return logoutUser;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async getNotesById(userId) {
        try {
            const notes = await userRepository.getNotesById(userId);
            if (!notes)
                return null;
            return notes;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async createNote(userId, title, content) {
        try {
            const newNote = await userRepository.createNote(userId, title, content);
            if (!newNote)
                throw new AppError_1.AppError("CreateNoteError", 400);
            return newNote;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async deleteNote(userId, noteId) {
        try {
            const deleteResult = await userRepository.deleteNote(userId, noteId);
            if (!deleteResult)
                throw new AppError_1.AppError("NoteNotFound", 404);
            return true;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async updateNote(noteId, title, content, status) {
        try {
            const updateResult = await userRepository.updateNote(noteId, title, content, status);
            if (!updateResult)
                throw new AppError_1.AppError("NoteNotUpdated", 400);
            return true;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
}
exports.UserServices = UserServices;
