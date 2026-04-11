"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenServices = void 0;
const UserRepository_1 = require("../repository/UserRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository = new UserRepository_1.UserRepository();
class TokenServices {
    constructor() { }
    generateAccessToken(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, String(process.env.JWT_ACCESS_SECRET), { expiresIn: "15m" });
        return accessToken;
    }
    generateRefreshToken(payload) {
        const refreshToken = jsonwebtoken_1.default.sign(payload, String(process.env.JWT_REFRESH_SECRET), { expiresIn: "1h" });
        return refreshToken;
    }
    verifyAccessToken(accessToken) {
        const validateToken = jsonwebtoken_1.default.verify(accessToken, String(process.env.JWT_ACCESS_SECRET));
        return validateToken;
    }
    verifyRefreshToken(refreshToken) {
        const validateToken = jsonwebtoken_1.default.verify(refreshToken, String(process.env.JWT_REFRESH_SECRET));
        return validateToken;
    }
    async saveRefreshToken(userId, refreshToken) {
        const newToken = await userRepository.saveRefreshToken(userId, refreshToken);
        if (!newToken)
            return false;
        return newToken;
    }
    async updateRefreshToken(userId, token) {
        const updatedToken = await userRepository.updateRefreshToken(userId, token);
        if (!updatedToken)
            return false;
        return updatedToken;
    }
    async getRefreshTokenById(tokenId) {
        const refreshToken = await userRepository.getRefreshTokenById(tokenId);
        if (!refreshToken) {
            return false;
        }
        return refreshToken;
    }
    async getRefreshTokenByUser(userId) {
        const refreshToken = await userRepository.getRefreshTokenByUser(userId);
        if (!refreshToken) {
            return false;
        }
        return refreshToken;
    }
    async removeRefreshToken(tokenId) {
        const removeToken = await userRepository.removeRefreshToken(tokenId);
        if (!removeToken)
            return false;
        return true;
    }
}
exports.TokenServices = TokenServices;
