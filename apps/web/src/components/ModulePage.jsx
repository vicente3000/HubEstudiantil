import { useEffect, useState } from "react";

export function ModulePage({ title, description, loadData, endpoints = [] }) {
  const [state, setState] = useState({
    status: "idle",
    payload: null,
    error: null
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setState({
        status: "loading",
        payload: null,
        error: null
      });

      try {
        const payload = await loadData();

        if (cancelled) return;

        setState({
          status: "success",
          payload,
          error: null
        });
      } catch (error) {
        if (cancelled) return;

        setState({
          status: "error",
          payload: null,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [loadData]);

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">Módulo</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      <div className="dashboard-grid">
        <article className="glass-card">
          <div className="card-head">
            <h4>Estado del módulo</h4>
            <span className={`status-chip status-chip--${state.status}`}>{state.status}</span>
          </div>
          <p className="muted-text no-top-margin">
            Esta pantalla ya está conectada al backend base para que el equipo pueda desarrollar encima.
          </p>
        </article>

        <article className="glass-card">
          <div className="card-head">
            <h4>Endpoints sugeridos</h4>
            <span className="soft-badge">API</span>
          </div>
          <ul className="simple-list">
            {endpoints.map((endpoint) => (
              <li key={endpoint}>
                <code>{endpoint}</code>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="glass-card">
        <div className="card-head">
          <h4>Respuesta actual</h4>
        </div>
        {state.status === "loading" && <p className="muted-text">Cargando información del módulo...</p>}
        {state.status === "error" && <p className="error-text">{state.error}</p>}
        {state.payload && <pre className="code-block">{JSON.stringify(state.payload, null, 2)}</pre>}
      </article>
    </section>
  );
}
