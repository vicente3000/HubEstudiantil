import type { Request, Response } from "express";
import { getHilosById, getHilosOverview } from "./hilos.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getHilosOverviewHandler(_request: Request, response: Response): void {
  response.json(getHilosOverview());
}

export function getHilosByIdHandler(request: Request, response: Response): void {
  response.json(getHilosById(getRouteParamValue(request.params.id)));
}
