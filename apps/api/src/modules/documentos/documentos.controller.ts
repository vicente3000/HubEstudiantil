import type { Request, Response } from "express";
import { getDocumentosById, getDocumentosOverview } from "./documentos.service.js";
import { getRouteParamValue } from "../../shared/utils/index.js";

export function getDocumentosOverviewHandler(_request: Request, response: Response): void {
  response.json(getDocumentosOverview());
}

export function getDocumentosByIdHandler(request: Request, response: Response): void {
  response.json(getDocumentosById(getRouteParamValue(request.params.id)));
}
