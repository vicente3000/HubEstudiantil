import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HealthPanel } from "../../components/HealthPanel.jsx";
import { useAuth } from "../auth/auth-context.jsx";
import { fetchApiOverview, fetchHealth } from "./dashboard.service.js";
import { DOCUMENTOS_ROLE_CODES, ROLE_LABELS } from "../../utils/constants.js";

const ROLE_DASHBOARD = {
  student: {
    eyebrow: "Panel estudiantil",
    title: "Tu campus virtual UCN",
    description: "Revisa avisos, actividades y peticiones desde un único lugar, con tu identidad institucional.",
    meta: "Acceso diseñado para estudiantes.",
    timeline: [
      { title: "Nuevos avisos para tu carrera", description: "No te pierdas los anuncios publicados por el área académica." },
      { title: "Peticiones en curso", description: "Sigue el estado de tus solicitudes desde el módulo de peticiones." },
      { title: "Actividades destacadas", description: "Consulta próximos eventos y actividades relevantes." }
    ]
  },
  ceal: {
    eyebrow: "Panel CEAL",
    title: "Monitorea operaciones CEAL",
    description: "Gestiona avisos, documentos y solicitudes con permisos de coordinación centralizada.",
    meta: "Incluye acceso a documentos y reportes internos.",
    timeline: [
      { title: "Documentos pendientes", description: "Revisa los archivos que requieren acción o aprobación." },
      { title: "Solicitudes asignadas", description: "Atiende las peticiones que están en tu cola de trabajo." },
      { title: "Mensajes recientes", description: "Comunícate con los equipos y consulta actualizaciones clave." }
    ]
  },
  jefatura: {
    eyebrow: "Panel de jefatura",
    title: "Supervisa procesos y solicitudes",
    description: "Controla documentos y peticiones desde una vista pensada para líderes de unidad.",
    meta: "Visibilidad reforzada para la toma de decisiones.",
    timeline: [
      { title: "Solicitud de revisión", description: "Asegura el avance de las gestiones del personal a tu cargo." },
      { title: "Documentos nuevos", description: "Valida la documentación que ya está disponible para tu unidad." },
      { title: "Estado de servicio", description: "Comprueba si el sistema está listo para tus próximos procesos." }
    ]
  },
  admin: {
    eyebrow: "Panel administrativo",
    title: "Control completo del sistema",
    description: "Administra usuarios, permisos, documentos y salud del servicio desde una sola vista.",
    meta: "Acceso total para administradores del proyecto.",
    timeline: [
      { title: "Usuarios activos", description: "Observa cuantos usuarios han iniciado sesión recientemente." },
      { title: "Peticiones pendientes", description: "Detecta solicitudes críticas que requieren atención inmediata." },
      { title: "Salud del sistema", description: "Verifica el estado de la API, la base de datos y la caché." }
    ]
  },
  default: {
    eyebrow: "Dashboard",
    title: "Accede para ver tu panel personalizado",
    description: "Inicia sesión para recibir una vista adaptada a tu rol en el sistema.",
    meta: "Si ya estás autenticado, espera unos segundos mientras cargamos tu perfil.",
    timeline: [
      { title: "Cargando perfil", description: "Esperando la información de tu cuenta institucional." }
    ]
  }
};

function getQuickLinks(roleCode) {
  const links = [
    { to: "/avisos", label: "Avisos", detail: "Comunicados y novedades" },
    { to: "/actividades", label: "Actividades", detail: "Eventos y noticias" },
    { to: "/hilos", label: "Hilos", detail: "Conversaciones activas" },
    { to: "/peticiones", label: "Peticiones", detail: "Solicitudes en trámite" }
  ];

  if (DOCUMENTOS_ROLE_CODES.includes(roleCode)) {
    links.push({ to: "/documentos", label: "Documentos", detail: "Materiales y archivos" });
  }

  if (roleCode === "admin") {
    links.push({ to: "/admin", label: "Admin", detail: "Gestión operativa" });
  }

  return links;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const roleCode = user?.roleCode;
  const roleLabel = ROLE_LABELS[roleCode] ?? "Usuario";
  const roleDashboard = ROLE_DASHBOARD[roleCode] ?? ROLE_DASHBOARD.default;

  const quickLinks = useMemo(() => getQuickLinks(roleCode), [roleCode]);

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
          <h1>Panel de {roleLabel}</h1>
          <p>Estas son las secciones y el estado general del sistema para tu rol en la plataforma.</p>
        </div>
      </header>

      <article className="hero-panel">
        <div className="hero-highlight">
          <span className="hero-highlight__eyebrow">{roleDashboard.eyebrow}</span>
          <strong>{roleDashboard.title}</strong>
          <p>{roleDashboard.description}</p>
          <small className="hero-highlight__meta">{roleDashboard.meta}</small>
        </div>
      </article>

      <div className="dashboard-grid">
        <article className="glass-card">
          <div className="card-head">
            <h4>API base</h4>
            <span className="soft-badge">JSON</span>
          </div>
          {overview ? <pre className="code-block">{JSON.stringify(overview, null, 2)}</pre> : <p>Cargando...</p>}
        </article>

        <article className="glass-card">
          <div className="card-head">
            <h4>Accesos rápidos</h4>
            <span className="soft-badge">Módulos</span>
          </div>
          <div className="access-grid">
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} className="access-item">
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="glass-card">
          <div className="card-head">
            <h4>{roleCode ? `Permisos de ${roleLabel}` : "Estado del perfil"}</h4>
            <span className="soft-badge">Rol</span>
          </div>
          <p>{roleCode ? `Usuario autenticado como ${roleLabel}.` : "Perfil no disponible aún."}</p>
          <div className="timeline">
            {roleDashboard.timeline.map((event) => (
              <div className="timeline__item" key={event.title}>
                <span className="timeline__dot" />
                <div>
                  <strong>{event.title}</strong>
                  <small>{event.description}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      {roleCode === "admin" && (
        <section className="admin-dashboard">
          <article className="glass-card">
            <div className="card-head">
              <div>
                <h4>KPIs globales</h4>
                <p>Vista consolidada de accesos, actividad y publicaciones de todos los CEALes.</p>
              </div>
              <span className="soft-badge">Administración</span>
            </div>
            <div className="access-grid">
              <div className="access-item">
                <strong>Ingresos</strong>
                <p>1.284 accesos al portal en el último periodo.</p>
              </div>
              <div className="access-item">
                <strong>Actividades</strong>
                <p>18 actividades activas publicadas este mes.</p>
              </div>
              <div className="access-item">
                <strong>CEALes activos</strong>
                <p>5 CEALes con publicaciones recientes en la plataforma.</p>
              </div>
              <div className="access-item">
                <strong>Mensajes destacados</strong>
                <p>9 publicaciones destacadas actualmente visibles en portada.</p>
              </div>
            </div>
          </article>

          <div className="dashboard-grid dashboard-grid--admin">
            <article className="glass-card">
              <div className="card-head">
                <div>
                  <h4>Actividad de CEALes</h4>
                  <p>Indicadores de publicaciones, hilos y peticiones por unidad.</p>
                </div>
                <span className="soft-badge">Resumen</span>
              </div>
              <div className="access-grid">
                <div className="access-item">
                  <strong>Avisos publicados</strong>
                  <p>34 avisos recientes para toda la organización.</p>
                </div>
                <div className="access-item">
                  <strong>Hilos activos</strong>
                  <p>21 conversaciones activas entre estudiantes y CEALes.</p>
                </div>
                <div className="access-item">
                  <strong>Peticiones en curso</strong>
                  <p>17 solicitudes abiertas en seguimiento.</p>
                </div>
                <div className="access-item">
                  <strong>Última actividad</strong>
                  <p>Actualizado hace 12 minutos.</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      <HealthPanel error={error} health={health} loading={loading} />
    </section>
  );
}
