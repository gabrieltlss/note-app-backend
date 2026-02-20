import { Note } from "./Note";
import { User } from "./User";

export interface IUserRepository {
    getUser: (email: string) => Promise<User | null>;
    createUser: (email: string) => Promise<number>;
    getUserById: (id: number) => Promise<Note[] | null>;
};