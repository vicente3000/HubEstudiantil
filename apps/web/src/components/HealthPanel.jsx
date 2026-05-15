export function HealthPanel({ health, loading, error }) {
  return (
    <article className="glass-card">
      <div className="card-head">
        <h4>Salud del sistema</h4>
        {health && <span className="soft-badge">Monitoreo</span>}
      </div>
      {loading && <p className="muted-text">Consultando API, base de datos y caché...</p>}
      {error && <p className="error-text">{error}</p>}
      {health && (
        <div className="health-grid">
          {Object.entries(health.services).map(([serviceName, serviceStatus]) => (
            <div className="health-card" key={serviceName}>
              <strong>{serviceName}</strong>
              <span className={`status-chip status-chip--${serviceStatus.status}`}>{serviceStatus.status}</span>
              {serviceStatus.message && <small className="muted-text">{serviceStatus.message}</small>}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
