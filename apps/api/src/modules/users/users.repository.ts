import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "users";

export function getUsersModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getUsersModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
