"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const AppError_1 = require("../errors/AppError");
function errorMiddleware(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal server error" });
}
