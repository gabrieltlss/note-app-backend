import { Handler } from "express";
import bcrypt from "bcrypt";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { TokenServices } from "../services/TokenServices";
import { UserServices } from "../services/UserServices";

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
        const user: User | undefined = req.user;
        if (typeof user !== "undefined") {
            try {
                if (!user.id || !user.email) return res.sendStatus(401);
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
                if (!saveRefreshToken) return res.sendStatus(500);
                res.cookie("refreshToken", { tokenId, refreshToken }, { httpOnly: true, secure: false, sameSite: "lax" });
                res.cookie("accessToken", { tokenId, accessToken }, { httpOnly: true, secure: false, sameSite: "lax" }); // secure: true em PRODUÇÃO.
                res.status(200).redirect("http://localhost:5173/home");
            } catch (error) {
                res.status(500);
            }
        }
    }

    public refreshToken: Handler = async (req, res) => {
        try {
            const { tokenId, refreshToken } = req.cookies.refreshToken;
            if (!refreshToken)
                return res.status(401).json({ status: 401, error: "InvalidToken" });

            const token = await tokenServices.verifyRefreshToken(refreshToken);
            if (typeof token === "string" || typeof token.id !== "number" || typeof token.email !== "string")
                return res.status(403).json({ status: 403, error: "InvalidToken" });

            const refreshTokenBD = await tokenServices.getRefreshTokenById(tokenId);
            if (!refreshTokenBD)
                return res.status(401).json({ status: 401, error: "InvalidToken" });

            const decodedRefreshTokenDb = bcrypt.compareSync(refreshToken, refreshTokenBD.token);
            if (!decodedRefreshTokenDb)
                return res.status(403).json({ status: 403, error: "InvalidToken" });

            const newAccessToken = tokenServices.generateAccessToken({ id: token.id, email: token.email });
            const newRefreshToken = tokenServices.generateRefreshToken({ id: token.id, email: token.email });

            const hashNewRefreshToken = bcrypt.hashSync(newRefreshToken, 10);
            const updateResult = await tokenServices.updateRefreshToken(token.id, hashNewRefreshToken);
            if (!updateResult)
                return res.status(500).json({ status: 500, error: "ServerError" });

            res.cookie("refreshToken", { tokenId, refreshToken: newRefreshToken }, { httpOnly: true, secure: false, sameSite: "lax" });
            res.cookie("accessToken", { tokenId, accessToken: newAccessToken }, { httpOnly: true, secure: false, sameSite: "lax" });
            res.status(201).json({ status: 201, message: "TokenCreated" });
        } catch (err) {
            if (err instanceof TokenExpiredError)
                return res.status(401).json({ status: 401, error: "InvalidToken" });
            if (err instanceof NotBeforeError || err instanceof JsonWebTokenError)
                return res.status(403).json({ status: 403, error: "InvalidToken" });
            res.status(500).json({ status: 500, error: "ServerError" });
        }
    }

    public getUserInfo: Handler = async (req, res) => {
        try {
            const user = req.user as { id: number, email: string };
            if (typeof user === "undefined")
                return res.status(401).json({ status: 401, error: "UserNotDefined" });
            if (typeof user.id !== "number" || typeof user.email !== "string")
                return res.status(403).json({ status: 403, error: "InvalidUser" });

            const getUser = await userServices.getUserById(user.id);
            if (!getUser) return res.status(404).json({ status: 404, error: "UserNotFound" });

            res.status(200).json(getUser);
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, error: "ServerError" });
        }
    }

    public deleteUser: Handler = async (req, res) => {
        try {
            const user = req.user as { id: number, email: string };
            if (typeof user === "undefined")
                return res.status(401).json({ status: 401, error: "UserNotDefined" });
            if (typeof user.id !== "number" || typeof user.email !== "string")
                return res.status(403).json({ status: 403, error: "InvalidUser" });

            const deleteUser = await userServices.deleteUser(user.id);
            if (!deleteUser) return res.status(404).json({ status: 404, error: "UserNotFound" });

            res.status(200).json({ status: 200, error: "UserDeleted" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: 500, error: "ServerError" });
        }
    }

    public getNotesById: Handler = async (req, res) => {
        try {
            const user = req.user as { id: number, email: string };
            if (typeof user === "undefined")
                return res.status(401).json({ status: 401, error: "UserNotDefined" });
            if (typeof user.id !== "number" || typeof user.email !== "string")
                return res.status(403).json({ status: 403, error: "InvalidUser" });

            const getUser = await userServices.getUserById(user.id);
            if (!getUser) return res.status(404).json({ status: 404, error: "UserNotFound" });

            const notes = await userServices.getNotesById(user.id);
            if (!notes) return res.status(204).json({ notes: [] });
            res.status(200).json(notes);
        } catch (error) {
            res.status(500).json({ status: 500, error: "ServerError" });
        }
    }

    public deleteNote: Handler = async (req, res) => {
        try {
            const user = req.user as { id: number, email: string };
            if (typeof user === "undefined")
                return res.status(401).json({ status: 401, error: "UserNotDefined" });
            if (typeof user.id !== "number" || typeof user.email !== "string")
                return res.status(403).json({ status: 403, error: "InvalidUser" });

            const noteIdParam = req.params.noteId;
            if (!noteIdParam || Array.isArray(noteIdParam))
                return res.status(400).json({ status: 400, error: "InvalidId" });

            const noteId = parseInt(noteIdParam);
            if (isNaN(noteId))
                return res.status(400).json({ status: 400, error: "InvalidId" });

            const deleteResult = await userServices.deleteNote(user.id, noteId);
            if (!deleteResult)
                return res.status(404).json({ status: 404, error: "NoteNotFound" });

            res.status(200).json({ status: 200, message: "NoteDeleted" });
        } catch (error) {
            res.status(500).json({ status: 500, error: "ServerError" });
        }
    }

    public createNote: Handler = async (req, res) => {
        try {
            const user = req.user as { id: number, email: string };
            if (typeof user === "undefined")
                return res.status(401).json({ status: 401, error: "UserNotDefined" });
            if (typeof user.id !== "number" || typeof user.email !== "string")
                return res.status(403).json({ status: 403, error: "InvalidUser" });

            const { title, content } = req.body;
            if (
                typeof title !== "string" || typeof content !== "string" ||
                title.trim() === "" || content.trim() === ""
            ) return res.status(400).json({ status: 400, error: "InvalidFields" });

            const getUser = await userServices.getUserById(user.id);
            if (!getUser) return res.status(404).json({ status: 404, error: "UserNotFound" });

            const noteId = await userServices.createNote(user.id, title, content);
            if (!noteId) return res.status(500).json({ status: 500, error: "ServerError" });
            res.status(201).json({ status: 201, message: "NoteCreated" });
        } catch (error) {
            res.status(500).json({ status: 500, error: "ServerError" });
        }
    }

    public updateNote: Handler = async (req, res) => {
        try {
            const user = req.user as { id: number, email: string };
            if (typeof user === "undefined")
                return res.status(401).json({ status: 401, error: "UserNotDefined" });
            if (typeof user.id !== "number" || typeof user.email !== "string")
                return res.status(403).json({ status: 403, error: "InvalidUser" });

            const { title, content, status } = req.body;
            const noteId = req.params.noteId;
            if (typeof noteId === "undefined" ||
                Array.isArray(noteId) ||
                typeof title === "undefined" ||
                typeof content === "undefined" ||
                typeof status === "undefined") {
                return res.status(403).json({ status: 403, error: "InvalidFields" });
            }
            // Fazer checagem dos campos...
            const updatedNote = await userServices.updateNote(parseInt(noteId), title, content, status);
            if (!updatedNote) {
                return res.status(400).json({ status: 400, error: "NoteNotUpdated" });
            }

            res.status(200).json({ status: 200, message: "NoteUpdated" });
        } catch (error) {
            res.status(500).json({ status: 500, error: "ServerError" });
        }
    }
}