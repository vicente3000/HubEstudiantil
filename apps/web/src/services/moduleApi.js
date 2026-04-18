import { http } from "./http.js";

export async function fetchModuleOverview(moduleName) {
  const { data } = await http.get(`/${moduleName}`);
  return data;
}

export async function fetchModuleItem(moduleName, itemId = "demo") {
  const { data } = await http.get(`/${moduleName}/${itemId}`);
  return data;
}
