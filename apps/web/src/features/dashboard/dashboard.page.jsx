import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HealthPanel } from "../../components/HealthPanel.jsx";
import { fetchApiOverview, fetchHealth } from "./dashboard.service.js";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const [overviewPayload, healthPayload] = await Promise.all([fetchApiOverview(), fetchHealth()]);

        if (cancelled) return;

        setOverview(overviewPayload);
        setHealth(healthPayload);
      } catch (requestError) {
        if (cancelled) return;

        setError(requestError instanceof Error ? requestError.message : "No fue posible consultar el API");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">Dashboard</span>
          <h1>Estado del entorno de desarrollo</h1>
          <p>
            Esta vista ayuda al equipo a validar que el frontend puede hablar con el backend y que los servicios base
            del proyecto estan disponibles.
          </p>
        </div>
      </header>

      <div className="card-grid">
        <article className="card">
          <h2>API base</h2>
          {overview ? <pre className="code-block">{JSON.stringify(overview, null, 2)}</pre> : <p>Cargando...</p>}
        </article>

        <article className="card">
          <h2>Accesos rapidos</h2>
          <ul className="simple-list">
            <li>
              <Link to="/avisos">Modulo Avisos</Link>
            </li>
            <li>
              <Link to="/peticiones">Modulo Peticiones</Link>
            </li>
            <li>
              <Link to="/documentos">Modulo Documentos</Link>
            </li>
          </ul>
        </article>
      </div>

      <HealthPanel error={error} health={health} loading={loading} />
    </section>
  );
}
