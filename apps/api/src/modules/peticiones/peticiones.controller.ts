import type { Request, Response } from "express";
import { getPeticionesById, getPeticionesOverview } from "./peticiones.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getPeticionesOverviewHandler(_request: Request, response: Response): void {
  response.json(getPeticionesOverview());
}

export function getPeticionesByIdHandler(request: Request, response: Response): void {
  response.json(getPeticionesById(getRouteParamValue(request.params.id)));
}
