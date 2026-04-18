import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "avisos";

export function getAvisosModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getAvisosModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
