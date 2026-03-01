import { Note } from "./Note";
import { User } from "./User";
import { Token } from "./Token";

export interface IUserRepository {
    // User
    getUser: (email: string) => Promise<User | null>;
    createUser: (email: string) => Promise<number>;
    // Token
    saveRefreshToken: (userId: number, refreshToken: string) => Promise<number>;
    getRefreshTokenById: (tokenId: number) => Promise<Token | null>;
    getRefreshTokenByUser: (userId: number) => Promise<Token | null>;
    updateRefreshToken: (userId: number, token: string) => Promise<number>;
    removeRefreshToken: (tokenId: number) => Promise<boolean>;
    // Notas
    getNotesById: (userId: number) => Promise<Note[] | null>;
};