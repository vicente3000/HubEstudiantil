import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { getAdminByIdHandler, getAdminOverviewHandler } from "./admin.controller.js";

const router = Router();

router.get("/", requireAuth, requireRole("admin"), getAdminOverviewHandler);
router.get("/:id", requireAuth, requireRole("admin"), getAdminByIdHandler);

export default router;
