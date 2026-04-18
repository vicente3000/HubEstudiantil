import { getRolesModuleItemPreview, getRolesModuleSummary } from "./roles.repository.js";

export function getRolesOverview() {
  return {
    ...getRolesModuleSummary(),
    layer: "service"
  };
}

export function getRolesById(itemId: string) {
  return {
    ...getRolesModuleItemPreview(itemId),
    layer: "service"
  };
}
