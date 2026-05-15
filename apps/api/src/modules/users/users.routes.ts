import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { getCurrentUserHandler, getUsersByIdHandler, getUsersOverviewHandler } from "./users.controller.js";

const router = Router();

router.get("/me", requireAuth, getCurrentUserHandler);
router.get("/", getUsersOverviewHandler);
router.get("/:id", getUsersByIdHandler);

export default router;
