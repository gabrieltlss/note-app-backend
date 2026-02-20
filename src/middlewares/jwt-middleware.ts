import { Handler } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT: Handler = (req, res, next) => {
    const token: string = req.cookies.accessToken;
    if (!token) return res.sendStatus(401);

    try {
        const user = jwt.verify(token, String(process.env.JWT_SECRET));
        req.user = user;
        next();
    } catch {
        return res.sendStatus(403);
    }
    res.sendStatus(401);
};