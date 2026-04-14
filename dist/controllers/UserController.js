"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const TokenServices_1 = require("../services/TokenServices");
const UserServices_1 = require("../services/UserServices");
const AppError_1 = require("../errors/AppError");
const tokenServices = new TokenServices_1.TokenServices();
const userServices = new UserServices_1.UserServices();
class UserController {
    constructor() { }
    googleCallback = async (req, res) => {
        const user = req.user;
        if (typeof user === "undefined")
            throw new AppError_1.AppError("UserNotDefined", 401);
        if (!user.id || !user.email)
            throw new AppError_1.AppError("InvalidUser", 401);
        const refreshTokenDbExists = await tokenServices.getRefreshTokenByUser(user.id);
        const userPayload = { id: Number(user.id), email: String(user.email) };
        const accessToken = tokenServices.generateAccessToken(userPayload);
        const refreshToken = tokenServices.generateRefreshToken(userPayload);
        const hashRefreshToken = bcrypt_1.default.hashSync(refreshToken, 10);
        let saveRefreshToken;
        let tokenId;
        if (refreshTokenDbExists) {
            saveRefreshToken = await tokenServices.updateRefreshToken(Number(user.id), hashRefreshToken);
            tokenId = refreshTokenDbExists["token_id"];
        }
        else if (!refreshTokenDbExists) {
            saveRefreshToken = await tokenServices.saveRefreshToken(Number(user.id), hashRefreshToken);
            tokenId = saveRefreshToken; // este retorna id do token inserido no BD.
        }
        res.cookie("refreshToken", { tokenId, refreshToken }, { httpOnly: true, secure: true, sameSite: "strict" });
        res.cookie("accessToken", { tokenId, accessToken }, { httpOnly: true, secure: true, sameSite: "strict" }); // secure: true em PRODUÇÃO.
        res.status(200).redirect(`${process.env.FRONT_URL}/home`);
    };
    refreshToken = async (req, res) => {
        const { tokenId, refreshToken } = req.cookies.refreshToken;
        if (!refreshToken)
            throw new AppError_1.AppError("InvalidToken", 401);
        const token = tokenServices.verifyRefreshToken(refreshToken);
        if (typeof token === "string" || typeof token.id !== "number" || typeof token.email !== "string")
            throw new AppError_1.AppError("InvalidToken", 403);
        const refreshTokenBD = await tokenServices.getRefreshTokenById(tokenId);
        tokenServices.decodeRefreshToken(refreshToken, refreshTokenBD.token);
        const newAccessToken = tokenServices.generateAccessToken({ id: token.id, email: token.email });
        const newRefreshToken = tokenServices.generateRefreshToken({ id: token.id, email: token.email });
        const hashNewRefreshToken = bcrypt_1.default.hashSync(newRefreshToken, 10);
        await tokenServices.updateRefreshToken(token.id, hashNewRefreshToken);
        res.cookie("refreshToken", { tokenId, refreshToken: newRefreshToken }, { httpOnly: true, secure: true, sameSite: "strict" });
        res.cookie("accessToken", { tokenId, accessToken: newAccessToken }, { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(201).json({ status: 201, message: "TokenCreated" });
    };
    logout = async (req, res) => {
        const user = req.user;
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if (typeof user === "undefined" || !accessToken || !refreshToken)
            throw new AppError_1.AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError_1.AppError("InvalidUser", 403);
        await userServices.logout(user.id);
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(200).json({ staus: 200, message: "Success" });
    };
    getUserInfo = async (req, res) => {
        const user = req.user;
        if (typeof user === "undefined")
            throw new AppError_1.AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError_1.AppError("InvalidUser", 403);
        const getUser = await userServices.getUserById(user.id);
        res.status(200).json(getUser);
    };
    deleteUser = async (req, res) => {
        const user = req.user;
        if (typeof user === "undefined")
            throw new AppError_1.AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError_1.AppError("InvalidUser", 403);
        await userServices.deleteUser(user.id);
        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(200).json({ status: 200, error: "UserDeleted" });
    };
    getNotesById = async (req, res) => {
        const user = req.user;
        if (typeof user === "undefined")
            throw new AppError_1.AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError_1.AppError("InvalidUser", 403);
        const getUser = await userServices.getUserById(user.id);
        if (getUser.id !== user.id)
            throw new AppError_1.AppError("InvalidUser", 403);
        const notes = await userServices.getNotesById(user.id);
        if (!notes)
            return res.status(204).json({ notes: [] });
        res.status(200).json(notes);
    };
    deleteNote = async (req, res) => {
        const user = req.user;
        if (typeof user === "undefined")
            throw new AppError_1.AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError_1.AppError("InvalidUser", 403);
        const noteIdParam = req.params.noteId;
        if (!noteIdParam || Array.isArray(noteIdParam))
            throw new AppError_1.AppError("InvalidId", 400);
        const noteId = parseInt(noteIdParam);
        if (isNaN(noteId))
            throw new AppError_1.AppError("InvalidId", 400);
        await userServices.deleteNote(user.id, noteId);
        res.status(200).json({ status: 200, message: "NoteDeleted" });
    };
    createNote = async (req, res) => {
        const user = req.user;
        if (typeof user === "undefined")
            throw new AppError_1.AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError_1.AppError("InvalidUser", 403);
        const { title, content } = req.body;
        if (typeof title !== "string" || typeof content !== "string" ||
            title.trim() === "" || content.trim() === "")
            throw new AppError_1.AppError("InvalidFields", 400);
        const getUser = await userServices.getUserById(user.id);
        if (getUser.id !== user.id)
            throw new AppError_1.AppError("InvalidUser", 403);
        await userServices.createNote(user.id, title, content);
        res.status(201).json({ status: 201, message: "NoteCreated" });
    };
    updateNote = async (req, res) => {
        const user = req.user;
        if (typeof user === "undefined")
            throw new AppError_1.AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError_1.AppError("InvalidUser", 403);
        const { title, content, status } = req.body;
        const noteId = req.params.noteId;
        if (typeof noteId === "undefined" ||
            Array.isArray(noteId) ||
            typeof title === "undefined" ||
            typeof content === "undefined" ||
            typeof status === "undefined")
            throw new AppError_1.AppError("InvalidFields", 403);
        await userServices.updateNote(parseInt(noteId), title, content, status);
        res.status(200).json({ status: 200, message: "NoteUpdated" });
    };
}
exports.UserController = UserController;
