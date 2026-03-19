"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const TokenServices_1 = require("../services/TokenServices");
const jsonwebtoken_1 = require("jsonwebtoken");
const tokenServices = new TokenServices_1.TokenServices();
const authenticateJWT = (req, res, next) => {
    // cookie: { tokenId, accessToken }
    console.log("ACCESS COOKIES:", req.cookies.accessToken);
    const cookie = req.cookies.accessToken;
    if (!cookie.accessToken)
        return res.status(401).json({ status: 401, error: "InvalidToken" });
    try {
        const user = tokenServices.verifyAccessToken(cookie.accessToken);
        if (typeof user === "string")
            return res.status(403).json({ status: 403, error: "InvalidToken" });
        if (typeof user.id === "number" && typeof user.email === "string") {
            req.user = { id: user.id, email: user.email };
            next();
            return;
        }
        return res.status(403).json({ status: 403, error: "InvalidToken" });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError)
            return res.status(401).json({ status: 401, error: "InvalidToken" });
        if (error instanceof jsonwebtoken_1.JsonWebTokenError || error instanceof jsonwebtoken_1.NotBeforeError) {
            return res.status(403).json({ status: 403, error: "InvalidToken" });
        }
        res.status(500).json({ status: 500, error: "InvalidToken" });
    }
};
exports.authenticateJWT = authenticateJWT;
