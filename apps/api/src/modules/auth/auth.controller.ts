import type { Request, Response } from "express";
import { getAuthById, getAuthOverview } from "./auth.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getAuthOverviewHandler(_request: Request, response: Response): void {
  response.json(getAuthOverview());
}

export function getAuthByIdHandler(request: Request, response: Response): void {
  response.json(getAuthById(getRouteParamValue(request.params.id)));
}
