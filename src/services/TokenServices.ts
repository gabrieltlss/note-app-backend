import { UserRepository } from "../repository/UserRepository";
import { TokenPayload } from "../types/TokenPayload";
import { Token } from "../types/Token";
import jwt from "jsonwebtoken";

const userRepository = new UserRepository();

export class TokenServices {
    constructor() { }

    public generateAccessToken(payload: object): string {
        const accessToken = jwt.sign(
            payload,
            String(process.env.JWT_ACCESS_SECRET),
            { expiresIn: "15m" }
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
        const validateToken: TokenPayload = jwt.verify(accessToken, String(process.env.JWT_ACCESS_SECRET));
        return validateToken;
    }

    public verifyRefreshToken(refreshToken: string): TokenPayload {
        const validateToken: TokenPayload = jwt.verify(refreshToken, String(process.env.JWT_REFRESH_SECRET));
        return validateToken;
    }

    public async saveRefreshToken(userId: number, refreshToken: string): Promise<boolean | number> {
        const newToken = await userRepository.saveRefreshToken(userId, refreshToken);
        if (!newToken) return false;
        return newToken;
    }

    public async updateRefreshToken(userId: number, token: string): Promise<number | boolean> {
        const updatedToken = await userRepository.updateRefreshToken(userId, token);
        if (!updatedToken) return false;
        return updatedToken;
    }

    public async getRefreshTokenById(tokenId: number): Promise<Token | false> {
        const refreshToken = await userRepository.getRefreshTokenById(tokenId);
        if (!refreshToken) { return false; }
        return refreshToken;
    }

    public async getRefreshTokenByUser(userId: number): Promise<Token | false> {
        const refreshToken = await userRepository.getRefreshTokenByUser(userId);
        if (!refreshToken) { return false; }
        return refreshToken;
    }

    private async removeRefreshToken(tokenId: number): Promise<boolean> {
        const removeToken = await userRepository.removeRefreshToken(tokenId);
        if (!removeToken) return false;
        return true;
    }
}