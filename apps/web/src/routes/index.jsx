import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import AuthCallbackPage from "../pages/AuthCallbackPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import DashboardPage from "../features/dashboard/dashboard.page.jsx";
import AvisosPage from "../features/avisos/avisos.page.jsx";
import ActividadesPage from "../features/actividades/actividades.page.jsx";
import HilosPage from "../features/hilos/hilos.page.jsx";
import PeticionesPage from "../features/peticiones/peticiones.page.jsx";
import DocumentosPage from "../features/documentos/documentos.page.jsx";
import AdminPage from "../features/admin/admin.page.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { RequireRole } from "./RequireRole.jsx";
import { DOCUMENTOS_ROLE_CODES } from "../utils/constants.js";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginPage />} path="/login" />
        <Route element={<AuthCallbackPage />} path="/auth/callback" />
        <Route element={<MainLayout />} path="/">
          <Route element={<HomePage />} index />
          <Route
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
            path="dashboard"
          />
          <Route
            element={
              <ProtectedRoute>
                <AvisosPage />
              </ProtectedRoute>
            }
            path="avisos"
          />
          <Route
            element={
              <ProtectedRoute>
                <ActividadesPage />
              </ProtectedRoute>
            }
            path="actividades"
          />
          <Route
            element={
              <ProtectedRoute>
                <HilosPage />
              </ProtectedRoute>
            }
            path="hilos"
          />
          <Route
            element={
              <ProtectedRoute>
                <PeticionesPage />
              </ProtectedRoute>
            }
            path="peticiones"
          />
          <Route
            element={
              <ProtectedRoute>
                <RequireRole allow={DOCUMENTOS_ROLE_CODES}>
                  <DocumentosPage />
                </RequireRole>
              </ProtectedRoute>
            }
            path="documentos"
          />
          <Route
            element={
              <ProtectedRoute>
                <RequireRole allow={["admin"]}>
                  <AdminPage />
                </RequireRole>
              </ProtectedRoute>
            }
            path="admin"
          />
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
