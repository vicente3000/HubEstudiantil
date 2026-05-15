import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../features/auth/auth-context.jsx";
import { appMeta, POST_LOGIN_REDIRECT_KEY } from "../utils/constants.js";
import { http } from "../services/http.js";

const DEMO_USERS = [
  { label: "Estudiante", email: "student.demo@ucn.cl" },
  { label: "Representante CEAL", email: "ceal.demo@ucn.cl" },
  { label: "Jefatura", email: "jefatura.demo@ucn.cl" },
  { label: "Administrador", email: "admin.demo@ucn.cl" }
];

const OAUTH_ERROR_MESSAGES = {
  access_denied: "Inicio de sesión cancelado en Google.",
  google_denied: "Google no autorizó el acceso.",
  invalid_state: "La sesión de OAuth expiró o es inválida. Intenta de nuevo.",
  missing_code: "Google no devolvió un código de autorización.",
  missing_token: "No se recibió el token en la aplicación. Intenta de nuevo.",
  email_not_verified: "Tu cuenta de Google no tiene el correo verificado.",
  account_inactive: "Tu cuenta está desactivada. Contacta a un administrador.",
  email_domain_not_allowed:
    "Solo se permiten cuentas nuevas con correo institucional autorizado. Si ya tienes usuario, inicia con ese correo.",
  email_already_registered: "Ese correo ya está registrado con otro vínculo. Contacta a un administrador.",
  google_login_failed: "No fue posible completar el inicio de sesión con Google."
};

function resolveOauthErrorMessage(code) {
  if (!code) {
    return null;
  }

  return OAUTH_ERROR_MESSAGES[code] ?? `Error de inicio de sesión (${code}).`;
}

function formatGoogleMissing(missing) {
  if (!missing || typeof missing !== "object") {
    return null;
  }

  const labels = [];
  if (missing.clientId) labels.push("GOOGLE_CLIENT_ID");
  if (missing.clientSecret) labels.push("GOOGLE_CLIENT_SECRET");
  if (missing.redirectUri) labels.push("GOOGLE_OAUTH_REDIRECT_URI");
  if (missing.webAppOrigin) labels.push("WEB_APP_ORIGIN");

  return labels.length > 0 ? labels.join(", ") : null;
}

export default function LoginPage() {
  const { loginWithDevToken, loginWithPassword, user, token, status } = useAuth();
  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [googleAllowedDomains, setGoogleAllowedDomains] = useState([]);
  const [googleMissing, setGoogleMissing] = useState(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const from = useMemo(() => {
    if (typeof location.state?.from === "string") {
      return location.state.from;
    }

    return sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY) ?? "/dashboard";
  }, [location.state]);
  const oauthErrorCode = searchParams.get("oauth_error");

  useEffect(() => {
    if (!oauthErrorCode) {
      return;
    }

    setError(resolveOauthErrorMessage(oauthErrorCode));

    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        next.delete("oauth_error");
        return next;
      },
      { replace: true }
    );
  }, [oauthErrorCode, setSearchParams]);

  useEffect(() => {
    let cancelled = false;

    async function loadOauthConfig() {
      try {
        const { data } = await http.get("/auth/oauth-config");

        if (!cancelled) {
          setGoogleEnabled(Boolean(data?.google?.enabled));
          setGoogleMissing(data?.google?.missing ?? null);
          setGoogleAllowedDomains(Array.isArray(data?.google?.allowedDomains) ? data.google.allowedDomains : []);
        }
      } catch {
        if (!cancelled) {
          setGoogleEnabled(false);
          setGoogleMissing(null);
          setGoogleAllowedDomains([]);
        }
      } finally {
        if (!cancelled) {
          setConfigLoaded(true);
        }
      }
    }

    void loadOauthConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  if (token && status === "loading") {
    return (
      <div className="auth-screen">
        <article className="auth-card auth-callback-card">
          <p className="muted-text">Cargando sesión...</p>
        </article>
      </div>
    );
  }

  if (token && user && status === "ready") {
    return <Navigate to={from} replace />;
  }

  async function handlePasswordLogin(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await loginWithPassword(email.trim(), password);
      navigate(from, { replace: true });
    } catch (requestError) {
      const message =
        requestError?.response?.data?.error?.message ??
        (requestError instanceof Error ? requestError.message : "No fue posible iniciar sesión");
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDevToken(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await loginWithDevToken(email);
      navigate(from, { replace: true });
    } catch (requestError) {
      const message =
        requestError?.response?.data?.error?.message ??
        (requestError instanceof Error ? requestError.message : "No fue posible iniciar sesión");
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  const apiBase = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
  const googleStartUrl = `${apiBase.replace(/\/$/, "")}/auth/google`;

  function startGoogle() {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, from);
    window.location.assign(googleStartUrl);
  }

  const missingList = formatGoogleMissing(googleMissing);

  return (
    <div className="auth-screen">
      <div className="auth-shell auth-shell--split">
        <section className="auth-brand">
          <div className="auth-brand__content">
            <div className="brand-badge" aria-hidden>
              <img alt="Universidad Católica del Norte" className="brand-badge__image" src="/Escudo-UCN-Logos.png" />
            </div>
            <div>
              <span className="eyebrow eyebrow--blue">Universidad Católica del Norte</span>
              <h1>{appMeta.name}</h1>
              <p>{appMeta.tagline}</p>
            </div>
          </div>
        </section>

        <section className="auth-card">
          <div className="auth-card__header">
            <h2>Acceso institucional</h2>
            <p>Ingresa con tu correo UCN y contraseña.</p>
          </div>

          {!configLoaded && <p className="muted-text">Cargando configuración...</p>}

          {configLoaded && googleEnabled && (
            <button className="google-btn" type="button" onClick={startGoogle}>
              <span className="google-btn__row">
                <span className="google-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path
                      d="M21.35 12.24c0-.74-.07-1.45-.19-2.13H12v4.02h5.25c-.23 1.18-.92 2.18-1.96 2.85v2.37h3.17c1.85-1.7 2.89-4.2 2.89-7.11z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 22c2.7 0 4.96-.89 6.61-2.41l-3.17-2.37c-.89.6-2.03.95-3.44.95-2.64 0-4.88-1.78-5.68-4.18H3.07v2.45C4.71 19.53 8.09 22 12 22z"
                      fill="#34A853"
                    />
                    <path
                      d="M6.32 13.99c-.2-.6-.31-1.24-.31-1.99s.11-1.39.31-1.99V7.56H3.07A9.996 9.996 0 0 0 2 12c0 1.61.39 3.14 1.07 4.44l3.25-2.45z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.49 0 2.82.51 3.87 1.52l2.9-2.9C16.95 2.09 14.69 1 12 1 8.09 1 4.71 3.47 3.07 7.56l3.25 2.45c.8-2.4 3.04-4.18 5.68-4.18z"
                      fill="#EA4335"
                    />
                  </svg>
                </span>
                Continuar con Google
              </span>
              <small>
                Solo dominios autorizados: {googleAllowedDomains.length > 0 ? googleAllowedDomains.join(", ") : "ucn.cl"}
              </small>
            </button>
          )}

          {configLoaded && !googleEnabled && (
            <p className="muted-text"></p>
          )}

          {configLoaded && googleEnabled && <div className="divider">o con correo y contraseña</div>}

          {configLoaded && !googleEnabled && <div className="divider">Correo y contraseña</div>}

          <form className="auth-form" onSubmit={handlePasswordLogin}>
            <label>
              Correo institucional
              <input
                autoComplete="username"
                disabled={busy}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nombre@ucn.cl"
                type="email"
                value={email}
              />
            </label>
            <label>
              Contraseña
              <input
                autoComplete="current-password"
                disabled={busy}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                type="password"
                value={password}
              />
            </label>
            <p className="auth-form__hint">Ingresa con tu correo institucional y contraseña.</p>
            <button className="btn btn--primary btn--block" disabled={busy} type="submit">
              {busy ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {import.meta.env.DEV && configLoaded && (
            <>
              <div className="divider">Acceso de desarrollo</div>
              <form className="auth-form" onSubmit={handleDevToken}>
                <p className="auth-form__hint">Disponible solo en entorno de desarrollo.</p>
                <label>
                  Usuario demo
                  <select disabled={busy} onChange={(event) => setEmail(event.target.value)} value={email}>
                    {DEMO_USERS.map((row) => (
                      <option key={row.email} value={row.email}>
                        {row.label} ({row.email})
                      </option>
                    ))}
                  </select>
                </label>
                <button className="btn btn--secondary btn--block" disabled={busy} type="submit">
                  {busy ? "Conectando..." : "Obtener token de desarrollo"}
                </button>
              </form>
            </>
          )}

          {error && <p className="error-text">{error}</p>}
        </section>
      </div>
    </div>
  );
}
