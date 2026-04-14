import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorMiddleware);

const PORT = 3001
app.listen(PORT, () => console.log("Server initialized in http://localhost:3001"));