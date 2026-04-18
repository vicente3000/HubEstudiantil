import { ModulePage } from "../../components/ModulePage.jsx";
import { fetchDocumentosOverview } from "./documentos.service.js";

export default function DocumentosPage() {
  return (
    <ModulePage
      title="Documentos"
      description="Repositorios compartidos y privados con metadata documental."
      loadData={fetchDocumentosOverview}
      endpoints={["GET /api/documentos", "GET /api/documentos/:id"]}
    />
  );
}
