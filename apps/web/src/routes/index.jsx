import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import DashboardPage from "../features/dashboard/dashboard.page.jsx";
import AvisosPage from "../features/avisos/avisos.page.jsx";
import ActividadesPage from "../features/actividades/actividades.page.jsx";
import HilosPage from "../features/hilos/hilos.page.jsx";
import PeticionesPage from "../features/peticiones/peticiones.page.jsx";
import DocumentosPage from "../features/documentos/documentos.page.jsx";
import AdminPage from "../features/admin/admin.page.jsx";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />} path="/">
          <Route element={<HomePage />} index />
          <Route element={<LoginPage />} path="login" />
          <Route element={<DashboardPage />} path="dashboard" />
          <Route element={<AvisosPage />} path="avisos" />
          <Route element={<ActividadesPage />} path="actividades" />
          <Route element={<HilosPage />} path="hilos" />
          <Route element={<PeticionesPage />} path="peticiones" />
          <Route element={<DocumentosPage />} path="documentos" />
          <Route element={<AdminPage />} path="admin" />
          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
