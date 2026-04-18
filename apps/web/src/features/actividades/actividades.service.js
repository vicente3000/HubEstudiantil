import { fetchModuleOverview } from "../../services/moduleApi.js";

export async function fetchActividadesOverview() {
  return fetchModuleOverview("actividades");
}
