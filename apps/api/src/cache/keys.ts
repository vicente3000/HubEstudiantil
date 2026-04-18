export const cacheKeys = {
  health: () => "system:health",
  session: (sessionId: string) => `sessions:${sessionId}`,
  userProfile: (userId: string) => `users:profile:${userId}`,
  userPermissions: (userId: string) => `users:permissions:${userId}`,
  avisoDetail: (avisoId: string) => `avisos:detail:${avisoId}`,
  avisosList: (scope = "public") => `avisos:list:${scope}`,
  actividadDetail: (actividadId: string) => `actividades:detail:${actividadId}`,
  actividadesList: (scope = "public") => `actividades:list:${scope}`,
  hiloDetail: (hiloId: string) => `hilos:detail:${hiloId}`,
  hiloMessages: (hiloId: string) => `hilos:messages:${hiloId}`,
  peticionDetail: (peticionId: string) => `peticiones:detail:${peticionId}`,
  peticionesByStatus: (statusCode: string) => `peticiones:status:${statusCode}`,
  dashboardSummary: (roleCode: string, scope = "global") => `dashboard:${roleCode}:${scope}`
};
