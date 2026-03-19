"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: `${process.env.ORIGIN_URL}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.default);
app.use((error, req, res, next) => {
    if (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Authentication failed", message: error.message || "Invalid credentials" });
    }
    next();
});
app.listen(3000, () => console.log("Server initialized in http://localhost:3000"));
