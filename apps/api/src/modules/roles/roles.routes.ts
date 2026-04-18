import { Router } from "express";
import { getRolesByIdHandler, getRolesOverviewHandler } from "./roles.controller.js";

const router = Router();

router.get("/", getRolesOverviewHandler);
router.get("/:id", getRolesByIdHandler);

export default router;
