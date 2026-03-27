import dotenv from "dotenv";
dotenv.config();
import express from "express";
import router from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Authentication failed", message: error.message || "Invalid credentials" });
    }
    next();
});

const PORT = 3001
app.listen(PORT, () => console.log("Server initialized in http://localhost:3001"));