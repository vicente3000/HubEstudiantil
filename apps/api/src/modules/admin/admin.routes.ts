import { Router } from "express";
import { getAdminByIdHandler, getAdminOverviewHandler } from "./admin.controller.js";

const router = Router();

router.get("/", getAdminOverviewHandler);
router.get("/:id", getAdminByIdHandler);

export default router;
