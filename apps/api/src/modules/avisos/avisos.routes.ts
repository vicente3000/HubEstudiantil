import { Router } from "express";
import { getAvisosByIdHandler, getAvisosOverviewHandler } from "./avisos.controller.js";

const router = Router();

router.get("/", getAvisosOverviewHandler);
router.get("/:id", getAvisosByIdHandler);

export default router;
