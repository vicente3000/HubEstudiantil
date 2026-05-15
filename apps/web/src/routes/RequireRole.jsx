import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context.jsx";

export function RequireRole({ allow, children }) {
  const { user, token, status } = useAuth();

  if (status === "loading") {
    return (
      <section className="page-stack">
        <p className="muted-text">Comprobando sesion...</p>
      </section>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allow.includes(user.roleCode)) {
    return (
      <section className="page-stack">
        <article className="glass-card">
          <header className="page-header" style={{ border: "none", margin: 0, padding: 0 }}>
            <div>
              <span className="page-eyebrow">Acceso</span>
              <h1>No autorizado</h1>
              <p>Tu perfil no tiene permiso para ver esta seccion.</p>
            </div>
          </header>
        </article>
      </section>
    );
  }

  return children;
}
