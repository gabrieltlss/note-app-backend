import { Handler } from "express";
import jwt from "jsonwebtoken";
import { UserServices } from "../services/UserServices";

interface User extends Express.User {
    id?: number;
    email?: string;
}

const userServices = new UserServices();

export class UserController {
    constructor() { }

    public googleCallback: Handler = (req, res) => {
        const user: User | undefined = req.user;

        if (typeof user !== "undefined") {
            const token: string = jwt.sign(
                { id: user.id, email: user.email },
                String(process.env.JWT_SECRET),
                { expiresIn: "1h" }
            );

            // Redireciona para o front com o token
            // res.cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "strict" });
            res.cookie("accessToken", token, { httpOnly: true, secure: false, sameSite: "lax" }); // secure: true em PRODUÇÃO.
            res.status(200).redirect("http://localhost:5173/oauth-success");
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