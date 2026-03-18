"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const UserRepository_1 = require("../repository/UserRepository");
const userRepository = new UserRepository_1.UserRepository();
class UserServices {
    async getUserById(user_id) {
        const user = await userRepository.getUserById(user_id);
        if (!user)
            return false;
        return user;
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
        const isUserDeleted = await userRepository.deleteUser(userId);
        if (!isUserDeleted)
            return null;
        return isUserDeleted;
    }
    async logout(userId) {
        const logoutUser = await userRepository.logout(userId);
        if (!logoutUser)
            return null;
        return logoutUser;
    }
    async getNotesById(userId) {
        const notes = await userRepository.getNotesById(userId);
        if (!notes)
            return null;
        return notes;
    }
    async createNote(userId, title, content) {
        const newNote = await userRepository.createNote(userId, title, content);
        if (!newNote)
            return false;
        return newNote;
    }
    async deleteNote(userId, noteId) {
        const deleteResult = await userRepository.deleteNote(userId, noteId);
        if (!deleteResult)
            return false;
        return true;
    }
    async updateNote(noteId, title, content, status) {
        const updateResult = await userRepository.updateNote(noteId, title, content, status);
        if (!updateResult)
            return false;
        return true;
    }
}
exports.UserServices = UserServices;
