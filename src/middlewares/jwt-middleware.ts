import { Handler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../types/User";

type userPayload = (User & jwt.JwtPayload) | string | undefined;

export const authenticateJWT: Handler = (req, res, next) => {
    const accessToken: string = req.cookies.accessToken;
    if (!accessToken) return res.sendStatus(401);

    jwt.verify(accessToken, String(process.env.JWT_ACCESS_SECRET), (err, user) => {
        if (err && err.name === "TokenExpiredError") {
            const refreshToken: string = req.cookies.refreshToken;
            if (!refreshToken) { return res.sendStatus(403).json({ error: "NoRefreshToken" }); }

            jwt.verify(refreshToken, String(process.env.JWT_REFRESH_SECRET), (err, user: userPayload) => {
                if (err) { return res.sendStatus(403); } // RefreshToken inválido -> redirecionar p/ login.

                if (typeof user !== "undefined" && typeof user !== "string") {
                    const newAccessToken = jwt.sign(
                        { id: user.id, email: user.email },
                        String(process.env.JWT_ACCESS_SECRET),
                        { expiresIn: "10s" }
                    );
                    res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: false, sameSite: "lax" });
                    req.user = user;
                    next();
                    return;
                }
            });
        }
        if (err) { return res.sendStatus(500); }

        req.user = user;
        next();
    });
};