import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context.jsx";
import { POST_LOGIN_REDIRECT_KEY } from "../utils/constants.js";

function parseTokenFromLocation() {
  const { hash, search } = window.location;

  const hashBody = hash.startsWith("#") ? hash.slice(1) : hash;
  const hashParams = new URLSearchParams(hashBody);
  const fromHash = hashParams.get("access_token") ?? hashParams.get("token");

  if (fromHash) {
    return fromHash;
  }

  const searchParams = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  return searchParams.get("access_token") ?? searchParams.get("token");
}

export default function AuthCallbackPage() {
  const { setToken, token, status, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    const parsed = parseTokenFromLocation();

    if (!parsed) {
      setError("No se recibió un token de acceso. Vuelve a iniciar sesión.");
      return;
    }

    setToken(parsed);
  }, [setToken]);

  useEffect(() => {
    if (error) {
      return;
    }

    if (!token || status !== "ready" || !user) {
      return;
    }

    const stored = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    const fromState = typeof location.state?.from === "string" ? location.state.from : null;
    const redirectTarget = fromState ?? stored ?? "/dashboard";

    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);

    try {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    } catch {
      /* ignore */
    }

    navigate(redirectTarget, { replace: true });
  }, [error, location.state, navigate, status, token, user]);

  return (
    <div className="auth-screen">
      <article className="auth-card auth-callback-card">
        <div className="auth-card__header">
          <h2>Finalizando acceso</h2>
          <p className="muted-text">
            {error ? "No pudimos completar el inicio de sesión." : "Validando tu sesión institucional..."}
          </p>
        </div>
        {error ? (
          <p className="error-text">{error}</p>
        ) : (
          <p className="muted-text">Te redirigiremos en un momento.</p>
        )}
      </article>
    </div>
  );
}
