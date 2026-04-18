import { ModulePage } from "../../components/ModulePage.jsx";
import { fetchAdministracionOverview } from "./admin.service.js";

export default function AdministracionPage() {
  return (
    <ModulePage
      title="Administracion"
      description="Gestion operativa de usuarios, roles y supervision."
      loadData={fetchAdministracionOverview}
      endpoints={["GET /api/admin", "GET /api/admin/:id"]}
    />
  );
}
