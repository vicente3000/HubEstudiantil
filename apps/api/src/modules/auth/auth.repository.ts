import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "auth";

export function getAuthModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getAuthModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
