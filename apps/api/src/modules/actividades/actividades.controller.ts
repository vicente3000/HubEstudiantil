import type { Request, Response } from "express";
import { getActividadesById, getActividadesOverview } from "./actividades.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getActividadesOverviewHandler(_request: Request, response: Response): void {
  response.json(getActividadesOverview());
}

export function getActividadesByIdHandler(request: Request, response: Response): void {
  response.json(getActividadesById(getRouteParamValue(request.params.id)));
}
