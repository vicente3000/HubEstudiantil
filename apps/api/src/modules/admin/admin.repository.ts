import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "admin";

export function getAdminModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getAdminModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
