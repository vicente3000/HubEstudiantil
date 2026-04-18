import { fetchModuleOverview } from "../../services/moduleApi.js";

export async function fetchHilosOverview() {
  return fetchModuleOverview("hilos");
}
