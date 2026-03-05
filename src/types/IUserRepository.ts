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
    // Notes
    getNotesById: (userId: number) => Promise<Note[] | null>;
    createNote: (userId: number, title: string, content: string) => Promise<number>;
    deleteNote: (noteId: number) => Promise<boolean>;
};