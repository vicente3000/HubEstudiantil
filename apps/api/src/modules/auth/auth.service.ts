import { getAuthModuleItemPreview, getAuthModuleSummary } from "./auth.repository.js";

export function getAuthOverview() {
  return {
    ...getAuthModuleSummary(),
    layer: "service"
  };
}

export function getAuthById(itemId: string) {
  return {
    ...getAuthModuleItemPreview(itemId),
    layer: "service"
  };
}
