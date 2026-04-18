import { Router } from "express";
import { getAuthByIdHandler, getAuthOverviewHandler } from "./auth.controller.js";

const router = Router();

router.get("/", getAuthOverviewHandler);
router.get("/:id", getAuthByIdHandler);

export default router;
