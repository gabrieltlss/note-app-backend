import { Handler } from "express";
import jwt from "jsonwebtoken";
import { UserServices } from "../services/UserServices";

// Manter Interface aqui? 
interface User extends Express.User {
    id?: number;
    email?: string;
}

const userServices = new UserServices();

export class UserController {
    constructor() { }

    public googleCallback: Handler = async (req, res) => {
        const user: User | undefined = req.user;

        if (typeof user !== "undefined") {
            const accessToken: string = jwt.sign(
                { id: user.id, email: user.email },
                String(process.env.JWT_ACCESS_SECRET),
                { expiresIn: "5s" } // Mudar
            );

            const refreshToken: string = jwt.sign(
                { id: user.id, email: user.email },
                String(process.env.JWT_REFRESH_SECRET),
                { expiresIn: "15s" } // Mudar
            );

            try {
                // 1 - Criptografar refreshToken...
                // 2 - saveRefreshToken tem boolean de sucesso -> estou incerto se faço uma verificação
                const saveRefreshToken = await userServices.saveRefreshToken(Number(user.id), refreshToken);
                res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: "lax" });
            } catch (error) {
                res.sendStatus(500);
            }
            res.cookie("accessToken", accessToken, { httpOnly: true, secure: false, sameSite: "lax" }); // secure: true em PRODUÇÃO.
            res.status(200).redirect("http://localhost:5173/home");
        }
    }

    public getNotesById: Handler = async (req, res) => {
        try {
            // const user: User | undefined = req.user;
            // if (user?.id) {
            //     const note = await userServices.getNoteById(user.id);
            //     res.status(200).json(note);
            //     return;
            // }

            // res.sendStatus(404);

            res.json({ notes: "Notes here..." })
        } catch (error) {
            res.sendStatus(404).json(error);
        }
    }
}