import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appMeta } from "../utils/constants.js";
import { fetchModuleOverview } from "../services/moduleApi.js";

const HUB_MODULES = [
  { key: "avisos", label: "Avisos", route: "/avisos" },
  { key: "actividades", label: "Actividades", route: "/actividades" },
  { key: "hilos", label: "Hilos", route: "/hilos" },
  { key: "peticiones", label: "Peticiones", route: "/peticiones" },
  { key: "documentos", label: "Documentos", route: "/documentos" }
];

export default function HomePage() {
  const [modules, setModules] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      setStatus("loading");
      setError(null);

      try {
        const items = await Promise.all(
          HUB_MODULES.map(async (module) => {
            const payload = await fetchModuleOverview(module.key);
            return {
              key: module.key,
              route: module.route,
              label: payload.label ?? module.label,
              description: payload.description ?? "Resumen del módulo.",
              status: payload.status ?? "unknown",
              apiPath: payload.apiPath ?? `/${module.key}`
            };
          })
        );

        if (!cancelled) {
          setModules(items);
          setStatus("ready");
        }
      } catch (requestError) {
        if (!cancelled) return;

        setError(requestError instanceof Error ? requestError.message : "No fue posible cargar el resumen del hub.");
        setStatus("error");
      }
    }

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">Inicio</span>
          <h1>Resumen del hub</h1>
          <p>Últimas entradas de datos y accesos directos a los módulos activos de la plataforma.</p>
        </div>
      </header>

      <article className="hero-panel">
        <div className="hero-highlight">
          <span className="hero-highlight__eyebrow">Actividad reciente</span>
          <strong>Latest updates desde avisos, actividades, hilos, peticiones y documentos</strong>
          <p>
            Explora rápidamente los módulos principales y revisa el estado de cada área del hub antes de continuar.
          </p>
          <small className="hero-highlight__meta">Universidad Católica del Norte · {appMeta.subtitle}</small>
        </div>
      </article>

      {status === "loading" && <p className="muted-text">Cargando el resumen de los módulos...</p>}
      {status === "error" && <p className="error-text">{error}</p>}

      <div className="dashboard-grid">
        {modules.map((module) => (
          <article className="glass-card" key={module.key}>
            <div className="card-head">
              <h4>{module.label}</h4>
              <span className={`status-chip status-chip--${module.status}`}>{module.status.replace(/_/g, " ")}</span>
            </div>
            <p>{module.description}</p>
            <div className="access-grid">
              <div className="access-item">
                <strong>Última vista</strong>
                <p>{module.apiPath}</p>
              </div>
              <div className="access-item">
                <strong>Acceso</strong>
                <p>
                  <Link to={module.route}>Ir a {module.label}</Link>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <article className="glass-card">
        <div className="card-head">
          <h4>Atajos rápidos</h4>
          <span className="soft-badge">Hub</span>
        </div>
        <div className="access-grid">
          {HUB_MODULES.map((module) => (
            <Link key={module.key} to={module.route} className="access-item">
              <strong>{module.label}</strong>
              <p>Revisa lo último en {module.label.toLowerCase()}.</p>
            </Link>
          ))}
        </div>
      </article>
    </section>
  );
}
