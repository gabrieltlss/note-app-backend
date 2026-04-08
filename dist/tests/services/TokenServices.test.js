"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenServices_1 = require("../../services/TokenServices");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("jsonwebtoken");
describe("testa serviços de tokens", () => {
    it("testa geração de tokens de acesso", () => {
        jsonwebtoken_1.default.sign.mockReturnValue("teste");
        const mockPayload = { id: 1, email: "teste@gmail.com" };
        const tokenService = new TokenServices_1.TokenServices();
        const token = tokenService.generateAccessToken(mockPayload);
        expect(token).toBe("teste");
    });
    it("testa corpo da geração de tokens", () => {
        const mockPayload = { id: 1, email: "teste@gmail.com" };
        const tokenService = new TokenServices_1.TokenServices();
        tokenService.generateAccessToken(mockPayload);
        expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith(mockPayload, expect.any(String), { expiresIn: "15m" });
    });
    it("testa geração de refreshToken", () => {
        jsonwebtoken_1.default.sign.mockReturnValue("teste refresh");
        const mockPayload = { id: 1, email: "teste@gmail.com" };
        const tokenService = new TokenServices_1.TokenServices();
        const token = tokenService.generateRefreshToken(mockPayload);
        expect(token).toBe("teste refresh");
    });
    it("testa corpo da geração de tokens", () => {
        const mockPayload = { id: 1, email: "teste@gmail.com" };
        const tokenService = new TokenServices_1.TokenServices();
        tokenService.generateRefreshToken(mockPayload);
        expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith(mockPayload, expect.any(String), { expiresIn: "1h" });
    });
});
