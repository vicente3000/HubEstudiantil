import { ModulePage } from "../../components/ModulePage.jsx";
import { fetchAvisosOverview } from "./avisos.service.js";

export default function AvisosPage() {
  return (
    <ModulePage
      title="Avisos"
      description="Publicacion y consulta de comunicados institucionales."
      loadData={fetchAvisosOverview}
      endpoints={["GET /api/avisos", "GET /api/avisos/:id"]}
    />
  );
}
