import { getAvisosModuleItemPreview, getAvisosModuleSummary } from "./avisos.repository.js";

export function getAvisosOverview() {
  return {
    ...getAvisosModuleSummary(),
    layer: "service"
  };
}

export function getAvisosById(itemId: string) {
  return {
    ...getAvisosModuleItemPreview(itemId),
    layer: "service"
  };
}
