import { TokenServices } from "../../services/TokenServices";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("testa serviços de tokens", () => {
    it("testa geração de tokens de acesso", () => {
        (jwt.sign as jest.Mock).mockReturnValue("teste");
        const mockPayload = { id: 1, email: "teste@gmail.com" };
        const tokenService = new TokenServices();
        const token = tokenService.generateAccessToken(mockPayload);
        expect(token).toBe("teste");
    })

    it("testa corpo da geração de tokens", () => {
        const mockPayload = { id: 1, email: "teste@gmail.com" };
        const tokenService = new TokenServices();
        tokenService.generateAccessToken(mockPayload);
        expect(jwt.sign).toHaveBeenCalledWith(
            mockPayload,
            expect.any(String),
            { expiresIn: "15m" }
        )
    })

    it("testa geração de refreshToken", () => {
        (jwt.sign as jest.Mock).mockReturnValue("teste refresh");
        const mockPayload = { id: 1, email: "teste@gmail.com" };
        const tokenService = new TokenServices();
        const token = tokenService.generateRefreshToken(mockPayload);
        expect(token).toBe("teste refresh");
    })

    it("testa corpo da geração de tokens", () => {
        const mockPayload = { id: 1, email: "teste@gmail.com" };
        const tokenService = new TokenServices();
        tokenService.generateRefreshToken(mockPayload);
        expect(jwt.sign).toHaveBeenCalledWith(
            mockPayload,
            expect.any(String),
            { expiresIn: "1h" }
        )
    })
})