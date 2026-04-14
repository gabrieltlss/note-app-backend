import { Handler } from "express";
import bcrypt from "bcrypt";
import { TokenServices } from "../services/TokenServices";
import { UserServices } from "../services/UserServices";
import { AppError } from "../errors/AppError";

// Manter Interface aqui? 
interface User extends Express.User {
    id?: number;
    email?: string;
}

const tokenServices = new TokenServices();
const userServices = new UserServices();

export class UserController {
    constructor() { }

    public googleCallback: Handler = async (req, res) => {
        const user = req.user as User;
        if (typeof user === "undefined") throw new AppError("UserNotDefined", 401);
        if (!user.id || !user.email) throw new AppError("InvalidUser", 401);

        const refreshTokenDbExists = await tokenServices.getRefreshTokenByUser(user.id);
        const userPayload = { id: Number(user.id), email: String(user.email) };
        const accessToken: string = tokenServices.generateAccessToken(userPayload);
        const refreshToken: string = tokenServices.generateRefreshToken(userPayload);
        const hashRefreshToken = bcrypt.hashSync(refreshToken, 10);
        let saveRefreshToken;
        let tokenId;
        if (refreshTokenDbExists) {
            saveRefreshToken = await tokenServices.updateRefreshToken(Number(user.id), hashRefreshToken);
            tokenId = refreshTokenDbExists["token_id"];
        } else if (!refreshTokenDbExists) {
            saveRefreshToken = await tokenServices.saveRefreshToken(Number(user.id), hashRefreshToken);
            tokenId = saveRefreshToken; // este retorna id do token inserido no BD.
        }
        res.cookie("refreshToken", { tokenId, refreshToken }, { httpOnly: true, secure: true, sameSite: "strict" });
        res.cookie("accessToken", { tokenId, accessToken }, { httpOnly: true, secure: true, sameSite: "strict" }); // secure: true em PRODUÇÃO.
        res.status(200).redirect(`${process.env.FRONT_URL}/home`);
    }

    public refreshToken: Handler = async (req, res) => {
        const { tokenId, refreshToken } = req.cookies.refreshToken;
        if (!refreshToken) throw new AppError("InvalidToken", 401);

        const token = tokenServices.verifyRefreshToken(refreshToken);
        if (typeof token === "string" || typeof token.id !== "number" || typeof token.email !== "string")
            throw new AppError("InvalidToken", 403);

        const refreshTokenBD = await tokenServices.getRefreshTokenById(tokenId);
        tokenServices.decodeRefreshToken(refreshToken, refreshTokenBD.token);

        const newAccessToken = tokenServices.generateAccessToken({ id: token.id, email: token.email });
        const newRefreshToken = tokenServices.generateRefreshToken({ id: token.id, email: token.email });

        const hashNewRefreshToken = bcrypt.hashSync(newRefreshToken, 10);
        await tokenServices.updateRefreshToken(token.id, hashNewRefreshToken);

        res.cookie("refreshToken", { tokenId, refreshToken: newRefreshToken }, { httpOnly: true, secure: true, sameSite: "strict" });
        res.cookie("accessToken", { tokenId, accessToken: newAccessToken }, { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(201).json({ status: 201, message: "TokenCreated" });
    }

    public logout: Handler = async (req, res) => {
        const user = req.user as { id: number, email: string };
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (typeof user === "undefined" || !accessToken || !refreshToken)
            throw new AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError("InvalidUser", 403);

        await userServices.logout(user.id);

        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(200).json({ staus: 200, message: "Success" });
    }

    public getUserInfo: Handler = async (req, res) => {
        const user = req.user as { id: number, email: string };
        if (typeof user === "undefined")
            throw new AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError("InvalidUser", 403);

        const getUser = await userServices.getUserById(user.id);
        res.status(200).json(getUser);
    }

    public deleteUser: Handler = async (req, res) => {
        const user = req.user as { id: number, email: string };
        if (typeof user === "undefined")
            throw new AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError("InvalidUser", 403);

        await userServices.deleteUser(user.id);

        res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "strict" });
        res.status(200).json({ status: 200, error: "UserDeleted" });
    }

    public getNotesById: Handler = async (req, res) => {
        const user = req.user as { id: number, email: string };
        if (typeof user === "undefined")
            throw new AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError("InvalidUser", 403);

        const getUser = await userServices.getUserById(user.id);
        if (getUser.id !== user.id) throw new AppError("InvalidUser", 403);

        const notes = await userServices.getNotesById(user.id);
        if (!notes) return res.status(204).json({ notes: [] });
        res.status(200).json(notes);
    }

    public deleteNote: Handler = async (req, res) => {
        const user = req.user as { id: number, email: string };
        if (typeof user === "undefined")
            throw new AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError("InvalidUser", 403);

        const noteIdParam = req.params.noteId;
        if (!noteIdParam || Array.isArray(noteIdParam))
            throw new AppError("InvalidId", 400);

        const noteId = parseInt(noteIdParam);
        if (isNaN(noteId))
            throw new AppError("InvalidId", 400);

        await userServices.deleteNote(user.id, noteId);
        res.status(200).json({ status: 200, message: "NoteDeleted" });
    }

    public createNote: Handler = async (req, res) => {
        const user = req.user as { id: number, email: string };
        if (typeof user === "undefined")
            throw new AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError("InvalidUser", 403);

        const { title, content } = req.body;

        if (typeof title !== "string" || typeof content !== "string" ||
            title.trim() === "" || content.trim() === "")
            throw new AppError("InvalidFields", 400);

        const getUser = await userServices.getUserById(user.id);
        if (getUser.id !== user.id) throw new AppError("InvalidUser", 403);

        await userServices.createNote(user.id, title, content);
        res.status(201).json({ status: 201, message: "NoteCreated" });
    }

    public updateNote: Handler = async (req, res) => {
        const user = req.user as { id: number, email: string };
        if (typeof user === "undefined")
            throw new AppError("UserNotDefined", 401);
        if (typeof user.id !== "number" || typeof user.email !== "string")
            throw new AppError("InvalidUser", 403);

        const { title, content, status } = req.body;
        const noteId = req.params.noteId;
        if (typeof noteId === "undefined" ||
            Array.isArray(noteId) ||
            typeof title === "undefined" ||
            typeof content === "undefined" ||
            typeof status === "undefined"
        ) throw new AppError("InvalidFields", 403);

        await userServices.updateNote(parseInt(noteId), title, content, status);
        res.status(200).json({ status: 200, message: "NoteUpdated" });
    }
}