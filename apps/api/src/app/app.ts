import cors from "cors";
import express, { Router } from "express";
import helmet from "helmet";
import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import rolesRoutes from "../modules/roles/roles.routes.js";
import avisosRoutes from "../modules/avisos/avisos.routes.js";
import actividadesRoutes from "../modules/actividades/actividades.routes.js";
import hilosRoutes from "../modules/hilos/hilos.routes.js";
import peticionesRoutes from "../modules/peticiones/peticiones.routes.js";
import documentosRoutes from "../modules/documentos/documentos.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import { query } from "../database/connection.js";
import { valkeyClient } from "../cache/connection.js";
import { errorMiddleware } from "../middlewares/error.middleware.js";
import { moduleRegistry } from "../shared/utils/index.js";

const app = express();
const apiRouter = Router();

app.use(helmet());
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_request, response) => {
  response.json({
    ok: true,
    name: "Hub Estudiantil API",
    status: "running",
    docsHint: "Usa /api o /api/health para validar el backend."
  });
});

apiRouter.get("/", (_request, response) => {
  response.json({
    ok: true,
    name: "Hub Estudiantil API",
    version: "0.1.0",
    modules: Object.values(moduleRegistry)
  });
});

apiRouter.get("/health", async (_request, response) => {
  const databaseStatus = await query("SELECT 1 AS ok")
    .then(() => ({ status: "up" }))
    .catch((error) => ({
      status: "down",
      message: error instanceof Error ? error.message : "Unknown database error"
    }));

  const cacheStatus = await (async () => {
    if (!valkeyClient.isReady) {
      return {
        status: valkeyClient.isOpen ? "starting" : "down",
        message: valkeyClient.isOpen
          ? "Valkey client is still connecting"
          : "Valkey client is not connected"
      };
    }

    try {
      const pingResponse = await valkeyClient.ping();

      return {
        status: pingResponse === "PONG" ? "up" : "degraded",
        message: pingResponse
      };
    } catch (error) {
      return {
        status: "down",
        message: error instanceof Error ? error.message : "Unknown cache error"
      };
    }
  })();

  const overallStatus =
    databaseStatus.status === "up" && cacheStatus.status === "up" ? "ok" : "degraded";

  response.status(overallStatus === "ok" ? 200 : 503).json({
    ok: overallStatus === "ok",
    status: overallStatus,
    services: {
      api: { status: "up" },
      database: databaseStatus,
      cache: cacheStatus
    }
  });
});

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", usersRoutes);
apiRouter.use("/roles", rolesRoutes);
apiRouter.use("/avisos", avisosRoutes);
apiRouter.use("/actividades", actividadesRoutes);
apiRouter.use("/hilos", hilosRoutes);
apiRouter.use("/peticiones", peticionesRoutes);
apiRouter.use("/documentos", documentosRoutes);
apiRouter.use("/admin", adminRoutes);

app.use("/api", apiRouter);
app.use(errorMiddleware);

export { app };
