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
                if (!user.id || !user.email) return res.sendStatus(403);
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

    public getNotesById: Handler = async (req, res) => {
        try {
            const cookie = req.cookies.accessToken;
            if (!cookie.accessToken) return res.sendStatus(401);

            const token = tokenServices.verifyAccessToken(cookie.accessToken); // {id: "userId", token: "token..."}
            if (typeof token === "string" || typeof token.id !== "number" || typeof token.email !== "string")
                return res.sendStatus(403);

            const notes = await userServices.getNotesById(token.id);
            if (!notes) return res.status(204).json({ notes: [] });

            res.status(200).json({ notes });
        } catch (error) {
            if (error instanceof TokenExpiredError) return res.sendStatus(401);
            if (error instanceof NotBeforeError || error instanceof JsonWebTokenError) return res.sendStatus(403);
            res.sendStatus(500);
            // Se obter erro ao recuperar notas (tratar no front-end)!
            // Enviar mensagem?
        }
    }

    public refreshToken: Handler = async (req, res) => {
        try {
            const { tokenId, refreshToken } = req.cookies.refreshToken;
            if (!refreshToken) return res.sendStatus(401);

            const token = await tokenServices.verifyRefreshToken(tokenId, refreshToken);
            if (typeof token === "string" || typeof token.id !== "number" || typeof token.email !== "string")
                return res.sendStatus(403);

            const refreshTokenBD = await tokenServices.getRefreshTokenById(tokenId);
            if (!refreshTokenBD) return res.sendStatus(401);

            const decodedRefreshTokenDb = bcrypt.compareSync(refreshToken, refreshTokenBD.token);
            if (!decodedRefreshTokenDb) return res.sendStatus(403);

            const newAccessToken = tokenServices.generateAccessToken({ id: token.id, email: token.email });
            res.cookie("accessToken", { tokenId, accessToken: newAccessToken }, { httpOnly: true, secure: false, sameSite: "lax" });
            res.sendStatus(201);
        } catch (err) {
            if (err instanceof TokenExpiredError) return res.sendStatus(401);
            if (err instanceof NotBeforeError || err instanceof JsonWebTokenError) return res.sendStatus(403);
            res.sendStatus(500);
        }
    }
}