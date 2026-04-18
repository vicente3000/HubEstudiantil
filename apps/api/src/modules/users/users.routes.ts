import { Router } from "express";
import { getUsersByIdHandler, getUsersOverviewHandler } from "./users.controller.js";

const router = Router();

router.get("/", getUsersOverviewHandler);
router.get("/:id", getUsersByIdHandler);

export default router;
