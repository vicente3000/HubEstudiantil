import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "documentos";

export function getDocumentosModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getDocumentosModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
