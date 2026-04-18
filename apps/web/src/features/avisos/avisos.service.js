import { fetchModuleOverview } from "../../services/moduleApi.js";

export async function fetchAvisosOverview() {
  return fetchModuleOverview("avisos");
}
