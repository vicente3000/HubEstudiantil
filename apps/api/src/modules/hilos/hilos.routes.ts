import { Router } from "express";
import { getHilosByIdHandler, getHilosOverviewHandler } from "./hilos.controller.js";

const router = Router();

router.get("/", getHilosOverviewHandler);
router.get("/:id", getHilosByIdHandler);

export default router;
