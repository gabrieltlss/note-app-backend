import { JwtPayload } from "jsonwebtoken";
import { User } from "./User";

export type TokenPayload = (User & JwtPayload) | string;
