import { Handler } from "express";
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { TokenServices } from "../services/TokenServices";

const tokenServices = new TokenServices();

export const authenticateJWT: Handler = (req, res, next) => {
    // cookie: { tokenId, accessToken }
    const cookie = req.cookies.accessToken;
    if (!cookie.accessToken) return res.sendStatus(401);

    try {
        const user = tokenServices.verifyAccessToken(cookie.accessToken);
        if (typeof user === "string") return res.sendStatus(403);
        if (typeof user.id === "number" && typeof user.email === "string") {
            req.user = { id: user.id, email: user.email };
            next();
            return;
        }
        return res.sendStatus(403);
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.sendStatus(401);
        }
        if (err instanceof NotBeforeError || err instanceof JsonWebTokenError) {
            return res.sendStatus(403);
        }
        res.sendStatus(500);
    }
};