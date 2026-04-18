import type { Request, Response } from "express";
import { getRolesById, getRolesOverview } from "./roles.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getRolesOverviewHandler(_request: Request, response: Response): void {
  response.json(getRolesOverview());
}

export function getRolesByIdHandler(request: Request, response: Response): void {
  response.json(getRolesById(getRouteParamValue(request.params.id)));
}
