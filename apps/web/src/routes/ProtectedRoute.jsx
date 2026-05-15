import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context.jsx";

export function ProtectedRoute({ children }) {
  const { token, status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <section className="page-stack">
        <p className="muted-text">Comprobando sesion...</p>
      </section>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
