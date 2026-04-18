import { ModulePage } from "../../components/ModulePage.jsx";
import { fetchAutenticacionOverview } from "./auth.service.js";

export default function AutenticacionPage() {
  return (
    <ModulePage
      title="Autenticacion"
      description="Base para Google OAuth, sesiones y control de acceso."
      loadData={fetchAutenticacionOverview}
      endpoints={["GET /api/auth", "GET /api/auth/:id"]}
    />
  );
}
