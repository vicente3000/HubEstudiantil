import { ModulePage } from "../../components/ModulePage.jsx";
import { fetchActividadesOverview } from "./actividades.service.js";

export default function ActividadesPage() {
  return (
    <ModulePage
      title="Actividades"
      description="Eventos, noticias y actividades relevantes del portal."
      loadData={fetchActividadesOverview}
      endpoints={["GET /api/actividades", "GET /api/actividades/:id"]}
    />
  );
}
