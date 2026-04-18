export type ModuleKey =
  | "auth"
  | "users"
  | "roles"
  | "avisos"
  | "actividades"
  | "hilos"
  | "peticiones"
  | "documentos"
  | "admin";

type ModuleRegistryItem = {
  key: ModuleKey;
  label: string;
  description: string;
  apiPath: string;
  tables: string[];
  dependsOnCache: boolean;
};

export const moduleRegistry: Record<ModuleKey, ModuleRegistryItem> = {
  auth: {
    key: "auth",
    label: "Autenticacion",
    description: "Gestion de acceso, inicio de sesion institucional y sesiones.",
    apiPath: "/api/auth",
    tables: ["users", "roles"],
    dependsOnCache: true
  },
  users: {
    key: "users",
    label: "Usuarios",
    description: "Gestion base de usuarios y perfiles del sistema.",
    apiPath: "/api/users",
    tables: ["users"],
    dependsOnCache: true
  },
  roles: {
    key: "roles",
    label: "Roles",
    description: "Catalogo y consulta de roles del sistema.",
    apiPath: "/api/roles",
    tables: ["roles"],
    dependsOnCache: false
  },
  avisos: {
    key: "avisos",
    label: "Avisos",
    description: "Publicacion y consulta de avisos institucionales.",
    apiPath: "/api/avisos",
    tables: ["avisos"],
    dependsOnCache: true
  },
  actividades: {
    key: "actividades",
    label: "Actividades",
    description: "Gestion de actividades, noticias y eventos del MVP.",
    apiPath: "/api/actividades",
    tables: ["actividades"],
    dependsOnCache: true
  },
  hilos: {
    key: "hilos",
    label: "Hilos",
    description: "Conversaciones, respuestas y trazabilidad de mensajes.",
    apiPath: "/api/hilos",
    tables: ["hilos", "hilo_mensajes"],
    dependsOnCache: true
  },
  peticiones: {
    key: "peticiones",
    label: "Peticiones",
    description: "Solicitudes estudiantiles, estados y seguimiento.",
    apiPath: "/api/peticiones",
    tables: ["peticiones", "peticion_estados", "peticion_historial"],
    dependsOnCache: true
  },
  documentos: {
    key: "documentos",
    label: "Documentos",
    description: "Repositorios compartidos y privados con metadata documental.",
    apiPath: "/api/documentos",
    tables: ["repositorios", "documentos"],
    dependsOnCache: true
  },
  admin: {
    key: "admin",
    label: "Administracion",
    description: "Operaciones de gestion de usuarios, accesos y supervision.",
    apiPath: "/api/admin",
    tables: ["users", "roles"],
    dependsOnCache: true
  }
};

export function getModuleInfo(moduleKey: ModuleKey): ModuleRegistryItem {
  return moduleRegistry[moduleKey];
}

export function buildModuleSummary(moduleKey: ModuleKey) {
  const moduleInfo = getModuleInfo(moduleKey);

  return {
    ok: true,
    module: moduleInfo.key,
    label: moduleInfo.label,
    description: moduleInfo.description,
    apiPath: moduleInfo.apiPath,
    status: "ready_for_implementation",
    tables: moduleInfo.tables,
    dependencies: {
      database: true,
      cache: moduleInfo.dependsOnCache
    },
    nextActions: [
      "Definir validaciones del modulo",
      "Implementar queries en repository",
      "Implementar reglas de negocio en service",
      "Conectar endpoints reales en controller"
    ]
  };
}

export function buildModuleItemPreview(moduleKey: ModuleKey, itemId: string) {
  const moduleInfo = getModuleInfo(moduleKey);

  return {
    ok: true,
    module: moduleInfo.key,
    item: {
      id: itemId,
      status: "placeholder",
      message: `El recurso ${itemId} del modulo ${moduleInfo.label} aun no tiene implementacion funcional.`,
      suggestedTables: moduleInfo.tables
    }
  };
}

export function getRouteParamValue(
  value: string | string[] | undefined,
  fallback = "demo"
): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}
