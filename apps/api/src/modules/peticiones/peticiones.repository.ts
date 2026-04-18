import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "peticiones";

export function getPeticionesModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getPeticionesModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
