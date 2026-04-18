import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "actividades";

export function getActividadesModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getActividadesModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
