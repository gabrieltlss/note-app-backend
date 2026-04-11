import { emitWarning } from "node:process";
import { TokenServices } from "../../services/TokenServices";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("teste de serviços de tokens", () => {
    describe("testes de access tokens", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            (jwt.sign as jest.Mock).mockReturnValue("teste");
        })

        it("geração de accessTokens", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const tokenService = new TokenServices();
            const token = tokenService.generateAccessToken(mockPayload);
            expect(token).toBe("teste");
        })

        it("corpo accessTokens", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const tokenService = new TokenServices();
            tokenService.generateAccessToken(mockPayload);
            expect(jwt.sign).toHaveBeenCalledWith(
                mockPayload,
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: "15m" }
            )
        })
    })

    describe("teste de refresh tokens", () => {
        const tokenService = new TokenServices();

        beforeEach(() => {
            jest.clearAllMocks();
            (jwt.sign as jest.Mock).mockReturnValue("teste");
        })

        it("geração de refreshToken", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const token = tokenService.generateRefreshToken(mockPayload);
            expect(token).toBe("teste");
        })

        it("corpo refreshTokens", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            tokenService.generateRefreshToken(mockPayload);
            expect(jwt.sign).toHaveBeenCalledWith(
                mockPayload,
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: "1h" }
            )
        })
    })

    describe("teste de verificação de tokens", () => {
        const mockPayload = { id: 1, email: "teste@gmail" };
        const tokenService = new TokenServices();

        beforeEach(() => {
            jest.clearAllMocks();
            (jwt.verify as jest.Mock).mockReturnValue(mockPayload);
        })

        it("verifica accessTokens", () => {
            const token = tokenService.verifyAccessToken("jwt-token");
            expect(jwt.verify).toHaveBeenCalledTimes(1);
            expect(jwt.verify).toHaveBeenCalledWith("jwt-token", process.env.JWT_ACCESS_SECRET);
            expect(token).toEqual(mockPayload);
        })

        it("verifica refreshTokens", () => {
            const token = tokenService.verifyRefreshToken("jwt-token");
            expect(jwt.verify).toHaveBeenCalledTimes(1);
            expect(jwt.verify).toHaveBeenCalledWith("jwt-token", process.env.JWT_REFRESH_SECRET);
            expect(token).toEqual(mockPayload);
        })
    })
})