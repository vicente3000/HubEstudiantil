import { fetchModuleOverview } from "../../services/moduleApi.js";

export async function fetchAdministracionOverview() {
  return fetchModuleOverview("admin");
}
