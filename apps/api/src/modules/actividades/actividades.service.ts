import { getActividadesModuleItemPreview, getActividadesModuleSummary } from "./actividades.repository.js";

export function getActividadesOverview() {
  return {
    ...getActividadesModuleSummary(),
    layer: "service"
  };
}

export function getActividadesById(itemId: string) {
  return {
    ...getActividadesModuleItemPreview(itemId),
    layer: "service"
  };
}
