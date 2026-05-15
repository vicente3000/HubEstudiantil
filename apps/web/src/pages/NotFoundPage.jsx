import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <span className="page-eyebrow">404</span>
          <h1>Ruta no encontrada</h1>
          <p>La vista solicitada no existe dentro de la aplicación base.</p>
        </div>
      </header>

      <article className="glass-card">
        <div className="card-head">
          <h4>Navegación</h4>
        </div>
        <Link className="btn btn--primary" to="/">
          Volver al inicio
        </Link>
      </article>
    </section>
  );
}
