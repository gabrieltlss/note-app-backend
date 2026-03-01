import { Router } from "express";
import { UserController } from "./controllers/UserController";
import { passport } from "./config/passport";
import { authenticateJWT } from "./middlewares/authAccessToken";

const router = Router();
const userController = new UserController();

router.get("/google", passport.authenticate("google", { scope: "email" }));
router.get("/googleCallback", passport.authenticate("google", { session: false }), userController.googleCallback);
router.get("/auth/refresh", userController.refreshToken);
router.get("/notes", authenticateJWT, userController.getNotesById);

export default router;