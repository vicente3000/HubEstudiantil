import { ModulePage } from "../components/ModulePage.jsx";
import { fetchAuthOverview } from "../features/auth/auth.service.js";

export default function LoginPage() {
  return (
    <ModulePage
      title="Autenticacion"
      description="Pantalla base para la futura integracion con Google OAuth y sesiones."
      loadData={fetchAuthOverview}
      endpoints={["GET /api/auth", "GET /api/auth/:id"]}
    />
  );
}
