import { fetchModuleOverview } from "../../services/moduleApi.js";

export async function fetchPeticionesOverview() {
  return fetchModuleOverview("peticiones");
}
