import type { Request, Response } from "express";
import { getUsersById, getUsersOverview } from "./users.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getUsersOverviewHandler(_request: Request, response: Response): void {
  response.json(getUsersOverview());
}

export function getUsersByIdHandler(request: Request, response: Response): void {
  response.json(getUsersById(getRouteParamValue(request.params.id)));
}
