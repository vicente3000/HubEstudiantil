import { Router } from "express";
import { getPeticionesByIdHandler, getPeticionesOverviewHandler } from "./peticiones.controller.js";

const router = Router();

router.get("/", getPeticionesOverviewHandler);
router.get("/:id", getPeticionesByIdHandler);

export default router;
