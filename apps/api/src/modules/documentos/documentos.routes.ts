import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { getDocumentosByIdHandler, getDocumentosOverviewHandler } from "./documentos.controller.js";

const router = Router();

const DOCUMENTOS_ALLOWED_ROLES = ["ceal", "jefatura", "admin"];

router.get("/", requireAuth, requireRole(DOCUMENTOS_ALLOWED_ROLES), getDocumentosOverviewHandler);
router.get("/:id", requireAuth, requireRole(DOCUMENTOS_ALLOWED_ROLES), getDocumentosByIdHandler);

export default router;
