import { Router } from "express";
import { getActividadesByIdHandler, getActividadesOverviewHandler } from "./actividades.controller.js";

const router = Router();

router.get("/", getActividadesOverviewHandler);
router.get("/:id", getActividadesByIdHandler);

export default router;
