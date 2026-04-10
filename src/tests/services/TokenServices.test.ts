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
        beforeEach(() => {
            jest.clearAllMocks();
            (jwt.sign as jest.Mock).mockReturnValue("teste");
        })
        it("geração de refreshToken", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const tokenService = new TokenServices();
            const token = tokenService.generateRefreshToken(mockPayload);
            expect(token).toBe("teste");
        })

        it("corpo refreshTokens", () => {
            const mockPayload = { id: 1, email: "teste@gmail.com" };
            const tokenService = new TokenServices();
            tokenService.generateRefreshToken(mockPayload);
            expect(jwt.sign).toHaveBeenCalledWith(
                mockPayload,
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: "1h" }
            )
        })
    })
})