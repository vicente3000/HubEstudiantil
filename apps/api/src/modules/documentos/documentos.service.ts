import { getDocumentosModuleItemPreview, getDocumentosModuleSummary } from "./documentos.repository.js";

export function getDocumentosOverview() {
  return {
    ...getDocumentosModuleSummary(),
    layer: "service"
  };
}

export function getDocumentosById(itemId: string) {
  return {
    ...getDocumentosModuleItemPreview(itemId),
    layer: "service"
  };
}
