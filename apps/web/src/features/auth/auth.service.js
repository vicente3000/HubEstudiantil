import { fetchModuleOverview } from "../../services/moduleApi.js";

export async function fetchAutenticacionOverview() {
  return fetchModuleOverview("auth");
}

export async function fetchAuthOverview() {
  return fetchAutenticacionOverview();
}
