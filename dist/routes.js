"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("./controllers/UserController");
const passport_1 = require("./config/passport");
const authAccessToken_1 = require("./middlewares/authAccessToken");
const router = (0, express_1.Router)();
const userController = new UserController_1.UserController();
router.get("/google", passport_1.passport.authenticate("google", { scope: "email" }));
router.get("/googleCallback", passport_1.passport.authenticate("google", { session: false, failWithError: true }), userController.googleCallback);
router.get("/auth/refresh", userController.refreshToken);
router.get("/auth/logout", authAccessToken_1.authenticateJWT, userController.logout);
// Notas
router.get("/notes", authAccessToken_1.authenticateJWT, userController.getNotesById);
router.post("/notes", authAccessToken_1.authenticateJWT, userController.createNote);
router.put("/notes/:noteId", authAccessToken_1.authenticateJWT, userController.updateNote);
router.delete("/notes/:noteId", authAccessToken_1.authenticateJWT, userController.deleteNote);
// Conta do usuário
router.get("/account/user", authAccessToken_1.authenticateJWT, userController.getUserInfo);
router.delete("/account/delete", authAccessToken_1.authenticateJWT, userController.deleteUser);
router.get("/test", (req, res) => res.status(200).json("ok"));
exports.default = router;
