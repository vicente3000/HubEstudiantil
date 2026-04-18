import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">Inicio</span>
          <h1>Hub Estudiantil</h1>
          <p>
            Base funcional del frontend y backend para que el equipo pueda desarrollar modulos reales sobre una
            arquitectura ya preparada.
          </p>
        </div>
      </header>

      <div className="card-grid">
        <article className="card">
          <h2>Que ya esta listo</h2>
          <ul className="simple-list">
            <li>React + Vite configurados</li>
            <li>API base con Express y TypeScript</li>
            <li>PostgreSQL y Valkey preparados</li>
            <li>Rutas iniciales por modulo</li>
          </ul>
        </article>

        <article className="card">
          <h2>Siguiente paso</h2>
          <p>Ir al dashboard para validar la conectividad del API y luego comenzar la implementacion por modulo.</p>
          <Link className="button-link" to="/dashboard">
            Ir al dashboard
          </Link>
        </article>
      </div>
    </section>
  );
}
