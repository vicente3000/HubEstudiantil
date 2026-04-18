import { getAdminModuleItemPreview, getAdminModuleSummary } from "./admin.repository.js";

export function getAdminOverview() {
  return {
    ...getAdminModuleSummary(),
    layer: "service"
  };
}

export function getAdminById(itemId: string) {
  return {
    ...getAdminModuleItemPreview(itemId),
    layer: "service"
  };
}
