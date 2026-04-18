import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "roles";

export function getRolesModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getRolesModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
