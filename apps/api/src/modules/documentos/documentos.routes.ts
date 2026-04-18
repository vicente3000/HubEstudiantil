import { Router } from "express";
import { getDocumentosByIdHandler, getDocumentosOverviewHandler } from "./documentos.controller.js";

const router = Router();

router.get("/", getDocumentosOverviewHandler);
router.get("/:id", getDocumentosByIdHandler);

export default router;
