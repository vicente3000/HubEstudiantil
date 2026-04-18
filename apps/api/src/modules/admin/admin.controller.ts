import type { Request, Response } from "express";
import { getAdminById, getAdminOverview } from "./admin.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getAdminOverviewHandler(_request: Request, response: Response): void {
  response.json(getAdminOverview());
}

export function getAdminByIdHandler(request: Request, response: Response): void {
  response.json(getAdminById(getRouteParamValue(request.params.id)));
}
