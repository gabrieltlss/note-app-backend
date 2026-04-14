"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repository/UserRepository");
const AppError_1 = require("../errors/AppError");
const userRepository = new UserRepository_1.UserRepository();
class TokenServices {
    constructor() { }
    generateAccessToken(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, String(process.env.JWT_ACCESS_SECRET), { expiresIn: "15s" });
        return accessToken;
    }
    generateRefreshToken(payload) {
        const refreshToken = jsonwebtoken_1.default.sign(payload, String(process.env.JWT_REFRESH_SECRET), { expiresIn: "1h" });
        return refreshToken;
    }
    verifyAccessToken(accessToken) {
        try {
            const validateToken = jsonwebtoken_1.default.verify(accessToken, String(process.env.JWT_ACCESS_SECRET));
            return validateToken;
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError)
                throw new AppError_1.AppError("InvalidToken", 401);
            if (err instanceof jsonwebtoken_1.default.NotBeforeError || err instanceof jsonwebtoken_1.default.JsonWebTokenError)
                throw new AppError_1.AppError("InvalidToken", 403);
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    verifyRefreshToken(refreshToken) {
        try {
            const validateToken = jsonwebtoken_1.default.verify(refreshToken, String(process.env.JWT_REFRESH_SECRET));
            return validateToken;
        }
        catch (err) {
            if (err instanceof jsonwebtoken_1.default.TokenExpiredError)
                throw new AppError_1.AppError("InvalidToken", 401);
            if (err instanceof jsonwebtoken_1.default.NotBeforeError || err instanceof jsonwebtoken_1.default.JsonWebTokenError)
                throw new AppError_1.AppError("InvalidToken", 403);
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async saveRefreshToken(userId, refreshToken) {
        try {
            const newToken = await userRepository.saveRefreshToken(userId, refreshToken);
            if (!newToken)
                throw new AppError_1.AppError("SaveTokenError", 400);
            return newToken;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async updateRefreshToken(userId, token) {
        try {
            const updatedToken = await userRepository.updateRefreshToken(userId, token);
            if (!updatedToken)
                throw new AppError_1.AppError("UpdateTokenError", 400);
            return updatedToken;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async getRefreshTokenById(tokenId) {
        try {
            const refreshToken = await userRepository.getRefreshTokenById(tokenId);
            if (!refreshToken)
                throw new AppError_1.AppError("InvalidToken", 401);
            return refreshToken;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    async getRefreshTokenByUser(userId) {
        try {
            const refreshToken = await userRepository.getRefreshTokenByUser(userId);
            if (!refreshToken)
                throw new AppError_1.AppError("GetTokenError", 400);
            return refreshToken;
        }
        catch (error) {
            throw new AppError_1.AppError("ServerError", 500);
        }
    }
    decodeRefreshToken(refreshToken, refreshTokenBD) {
        const decodedRefreshTokenDb = bcrypt_1.default.compareSync(refreshToken, refreshTokenBD);
        if (!decodedRefreshTokenDb)
            throw new AppError_1.AppError("InvalidToken", 403);
    }
    async removeRefreshToken(tokenId) {
        const removeToken = await userRepository.removeRefreshToken(tokenId);
        if (!removeToken)
            return false;
        return true;
    }
}
exports.TokenServices = TokenServices;
