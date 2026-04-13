import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/UserRepository";
import { TokenPayload } from "../types/TokenPayload";
import { Token } from "../types/Token";
import { AppError } from "../errors/AppError";

const userRepository = new UserRepository();

export class TokenServices {
    constructor() { }

    public generateAccessToken(payload: object): string {
        const accessToken = jwt.sign(
            payload,
            String(process.env.JWT_ACCESS_SECRET),
            { expiresIn: "15s" }
        );
        return accessToken;
    }

    public generateRefreshToken(payload: object): string {
        const refreshToken = jwt.sign(
            payload,
            String(process.env.JWT_REFRESH_SECRET),
            { expiresIn: "1h" }
        );
        return refreshToken;
    }

    public verifyAccessToken(accessToken: string): TokenPayload {
        try {
            const validateToken: TokenPayload = jwt.verify(accessToken, String(process.env.JWT_ACCESS_SECRET));
            return validateToken;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) throw new AppError("InvalidToken", 401);
            if (err instanceof jwt.NotBeforeError || err instanceof jwt.JsonWebTokenError)
                throw new AppError("InvalidToken", 403);
            throw new AppError("ServerError", 500);
        }
    }

    public verifyRefreshToken(refreshToken: string): TokenPayload {
        try {
            const validateToken: TokenPayload = jwt.verify(refreshToken, String(process.env.JWT_REFRESH_SECRET));
            return validateToken;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) throw new AppError("InvalidToken", 401);
            if (err instanceof jwt.NotBeforeError || err instanceof jwt.JsonWebTokenError)
                throw new AppError("InvalidToken", 403);
            throw new AppError("ServerError", 500);
        }
    }

    public async saveRefreshToken(userId: number, refreshToken: string): Promise<number> {
        try {
            const newToken = await userRepository.saveRefreshToken(userId, refreshToken);
            if (!newToken) throw new AppError("SaveTokenError", 500);
            return newToken;
        } catch (error) {
            throw new AppError("SaveTokenError", 500)
        }
    }

    public async updateRefreshToken(userId: number, token: string): Promise<number> {
        try {
            const updatedToken = await userRepository.updateRefreshToken(userId, token);
            if (!updatedToken) throw new AppError("SaveTokenError", 500);
            return updatedToken;
        } catch (error) {
            throw new AppError("SaveTokenError", 500);
        }
    }

    public async getRefreshTokenById(tokenId: number): Promise<Token> {
        try {
            const refreshToken = await userRepository.getRefreshTokenById(tokenId);
            if (!refreshToken) throw new AppError("InvalidToken", 401);
            return refreshToken;
        } catch (error) {
            throw new AppError("SaveTokenError", 500);
        }
    }

    public async getRefreshTokenByUser(userId: number): Promise<Token> {
        try {
            const refreshToken = await userRepository.getRefreshTokenByUser(userId);
            if (!refreshToken) throw new AppError("SaveTokenError", 500);
            return refreshToken;
        } catch (error) {
            throw new AppError("SaveTokenError", 500);
        }
    }

    public decodeRefreshToken(refreshToken: string, refreshTokenBD: string) {
        const decodedRefreshTokenDb = bcrypt.compareSync(refreshToken, refreshTokenBD);
        if (!decodedRefreshTokenDb) throw new AppError("InvalidToken", 403);
    }

    private async removeRefreshToken(tokenId: number): Promise<boolean> {
        const removeToken = await userRepository.removeRefreshToken(tokenId);
        if (!removeToken) return false;
        return true;
    }
}