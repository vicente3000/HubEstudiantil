export function HealthPanel({ health, loading, error }) {
  return (
    <article className="card">
      <h2>Salud del sistema</h2>
      {loading && <p>Consultando API, base de datos y cache...</p>}
      {error && <p className="error-text">{error}</p>}
      {health && (
        <div className="health-grid">
          {Object.entries(health.services).map(([serviceName, serviceStatus]) => (
            <div className="health-card" key={serviceName}>
              <strong>{serviceName}</strong>
              <span className={`status-chip status-chip--${serviceStatus.status}`}>{serviceStatus.status}</span>
              {serviceStatus.message && <small>{serviceStatus.message}</small>}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
