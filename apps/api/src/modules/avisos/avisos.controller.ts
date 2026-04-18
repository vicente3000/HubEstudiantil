import type { Request, Response } from "express";
import { getAvisosById, getAvisosOverview } from "./avisos.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getAvisosOverviewHandler(_request: Request, response: Response): void {
  response.json(getAvisosOverview());
}

export function getAvisosByIdHandler(request: Request, response: Response): void {
  response.json(getAvisosById(getRouteParamValue(request.params.id)));
}
