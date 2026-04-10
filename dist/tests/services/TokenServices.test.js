"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TokenServices_1 = require("../../services/TokenServices");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("jsonwebtoken");
describe("teste de serviços de tokens", () => {
    describe("testes de access tokens", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jsonwebtoken_1.default.sign.mockReturnValue("teste");
        });
        it("geração de accessTokens", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const tokenService = new TokenServices_1.TokenServices();
            const token = tokenService.generateAccessToken(mockPayload);
            expect(token).toBe("teste");
        });
        it("corpo accessTokens", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const tokenService = new TokenServices_1.TokenServices();
            tokenService.generateAccessToken(mockPayload);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith(mockPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
        });
    });
    describe("teste de refresh tokens", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jsonwebtoken_1.default.sign.mockReturnValue("teste");
        });
        it("geração de refreshToken", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const tokenService = new TokenServices_1.TokenServices();
            const token = tokenService.generateRefreshToken(mockPayload);
            expect(token).toBe("teste");
        });
        it("corpo refreshTokens", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const tokenService = new TokenServices_1.TokenServices();
            tokenService.generateRefreshToken(mockPayload);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith(mockPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1h" });
        });
    });
});
