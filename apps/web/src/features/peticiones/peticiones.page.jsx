import { ModulePage } from "../../components/ModulePage.jsx";
import { fetchPeticionesOverview } from "./peticiones.service.js";

export default function PeticionesPage() {
  return (
    <ModulePage
      title="Peticiones"
      description="Solicitudes estudiantiles con estados y seguimiento."
      loadData={fetchPeticionesOverview}
      endpoints={["GET /api/peticiones", "GET /api/peticiones/:id"]}
    />
  );
}
