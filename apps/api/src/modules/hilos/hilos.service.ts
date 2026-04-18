import { getHilosModuleItemPreview, getHilosModuleSummary } from "./hilos.repository.js";

export function getHilosOverview() {
  return {
    ...getHilosModuleSummary(),
    layer: "service"
  };
}

export function getHilosById(itemId: string) {
  return {
    ...getHilosModuleItemPreview(itemId),
    layer: "service"
  };
}
