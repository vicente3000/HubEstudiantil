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
          <span className="page-eyebrow">Modulo</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      <div className="card-grid">
        <article className="card">
          <h2>Estado del modulo</h2>
          <p>Esta pantalla ya esta conectada al backend base para que el equipo pueda desarrollar encima.</p>
          <span className={`status-chip status-chip--${state.status}`}>{state.status}</span>
        </article>

        <article className="card">
          <h2>Endpoints sugeridos</h2>
          <ul className="simple-list">
            {endpoints.map((endpoint) => (
              <li key={endpoint}>
                <code>{endpoint}</code>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <article className="card">
        <h2>Respuesta actual</h2>
        {state.status === "loading" && <p>Cargando informacion del modulo...</p>}
        {state.status === "error" && <p className="error-text">{state.error}</p>}
        {state.payload && <pre className="code-block">{JSON.stringify(state.payload, null, 2)}</pre>}
      </article>
    </section>
  );
}
