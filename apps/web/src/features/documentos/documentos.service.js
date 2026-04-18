import { fetchModuleOverview } from "../../services/moduleApi.js";

export async function fetchDocumentosOverview() {
  return fetchModuleOverview("documentos");
}
