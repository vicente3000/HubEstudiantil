export const POST_LOGIN_REDIRECT_KEY = "post_login_redirect";

export const appMeta = {
  name: "Hub Estudiantil",
  subtitle: "Escuela de Ingeniería",
  tagline:
    "Plataforma centralizada para avisos, actividades, peticiones y documentación académica con identidad UCN."
};

/** Píldoras de rol en sidebar (solo lectura; el rol activo viene del usuario). */
export const ROLE_STRIP = [
  { code: "student", label: "Estudiante" },
  { code: "ceal", label: "CEAL" },
  { code: "jefatura", label: "Jefatura" },
  { code: "admin", label: "Admin" }
];

export const ROLE_LABELS = {
  student: "Estudiante",
  ceal: "CEAL",
  jefatura: "Jefatura",
  admin: "Admin"
};

export const navigationItems = [
  { to: "/", label: "Inicio", caption: "Resumen del proyecto", icon: "IN" },
  { to: "/dashboard", label: "Dashboard", caption: "Salud del sistema", icon: "DB" },
  { to: "/avisos", label: "Avisos", caption: "Comunicados", icon: "AV" },
  { to: "/actividades", label: "Actividades", caption: "Eventos y noticias", icon: "AC" },
  { to: "/hilos", label: "Hilos", caption: "Conversaciones", icon: "HI" },
  { to: "/peticiones", label: "Peticiones", caption: "Solicitudes y estados", icon: "PE" },
  { to: "/documentos", label: "Documentos", caption: "Repositorios", icon: "DO" },
  { to: "/admin", label: "Admin", caption: "Gestión operativa", icon: "AD" },
  { to: "/login", label: "Acceso", caption: "Inicio de sesión", icon: "AU" }
];

export const DOCUMENTOS_ROLE_CODES = ["ceal", "jefatura", "admin"];

/**
 * @param {string | null | undefined} roleCode
 * @param {{ hasToken?: boolean }} [options]
 */
export function filterNavigationByRole(roleCode, options = {}) {
  const hasToken = Boolean(options.hasToken);

  if (!hasToken) {
    return navigationItems.filter((item) => item.to === "/" || item.to === "/login");
  }

  if (!roleCode) {
    return navigationItems.filter((item) => {
      if (item.to === "/" || item.to === "/login") return true;
      if (item.to === "/admin" || item.to === "/documentos") return false;
      return true;
    });
  }

  return navigationItems.filter((item) => {
    if (item.to === "/login") return false;
    if (item.to === "/admin") return roleCode === "admin";
    if (item.to === "/documentos") return DOCUMENTOS_ROLE_CODES.includes(roleCode);
    return true;
  });
}
