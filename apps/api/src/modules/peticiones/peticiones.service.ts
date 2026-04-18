import { getPeticionesModuleItemPreview, getPeticionesModuleSummary } from "./peticiones.repository.js";

export function getPeticionesOverview() {
  return {
    ...getPeticionesModuleSummary(),
    layer: "service"
  };
}

export function getPeticionesById(itemId: string) {
  return {
    ...getPeticionesModuleItemPreview(itemId),
    layer: "service"
  };
}
