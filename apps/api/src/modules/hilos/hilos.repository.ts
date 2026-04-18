import { buildModuleItemPreview, buildModuleSummary, type ModuleKey } from "../../shared/utils/index.js";

const moduleKey: ModuleKey = "hilos";

export function getHilosModuleSummary() {
  return buildModuleSummary(moduleKey);
}

export function getHilosModuleItemPreview(itemId: string) {
  return buildModuleItemPreview(moduleKey, itemId);
}
