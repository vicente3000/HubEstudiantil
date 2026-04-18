import { getUsersModuleItemPreview, getUsersModuleSummary } from "./users.repository.js";

export function getUsersOverview() {
  return {
    ...getUsersModuleSummary(),
    layer: "service"
  };
}

export function getUsersById(itemId: string) {
  return {
    ...getUsersModuleItemPreview(itemId),
    layer: "service"
  };
}
