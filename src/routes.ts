import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { passport } from "./config/passport";
import { authenticateJWT } from "./middlewares/authAccessToken";

const router = Router();
const userController = new UserController();

router.get("/google", passport.authenticate("google", { scope: "email" }));
router.get(
    "/googleCallback",
    passport.authenticate("google", { session: false, failWithError: true }),
    userController.googleCallback
);
router.get("/auth/refresh", userController.refreshToken);
router.get("/auth/logout", authenticateJWT, userController.logout);

// Notas
router.get("/notes", authenticateJWT, userController.getNotesById);
router.post("/notes", authenticateJWT, userController.createNote);
router.put("/notes/:noteId", authenticateJWT, userController.updateNote);
router.delete("/notes/:noteId", authenticateJWT, userController.deleteNote);

// Conta do usuário
router.get("/account/user", authenticateJWT, userController.getUserInfo);
router.delete("/account/delete", authenticateJWT, userController.deleteUser);

export default router;