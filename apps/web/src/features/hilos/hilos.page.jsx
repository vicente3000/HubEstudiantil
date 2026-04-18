import { ModulePage } from "../../components/ModulePage.jsx";
import { fetchHilosOverview } from "./hilos.service.js";

export default function HilosPage() {
  return (
    <ModulePage
      title="Hilos"
      description="Conversaciones estudiantiles y trazabilidad de respuestas."
      loadData={fetchHilosOverview}
      endpoints={["GET /api/hilos", "GET /api/hilos/:id"]}
    />
  );
}
