import { NavLink, Outlet } from "react-router-dom";
import { appMeta, filterNavigationByRole, POST_LOGIN_REDIRECT_KEY, ROLE_STRIP } from "../utils/constants.js";
import { useAuth } from "../features/auth/auth-context.jsx";

function initials(displayName) {  if (!displayName || typeof displayName !== "string") {
    return "?";
  }

  const parts = displayName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export default function MainLayout() {
  const { user, token, logout } = useAuth();
  const navigation = filterNavigationByRole(user?.roleCode, { hasToken: Boolean(token) });

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__top">
          <div className="sidebar__brand">
            <div className="sidebar__logo" aria-hidden>
              <img alt="Universidad Católica del Norte" className="sidebar__logo-image" src="/Escudo-UCN-Logos.png" />
            </div>
            <div>
              <strong>{appMeta.name}</strong>
              <small>{appMeta.subtitle}</small>
            </div>
          </div>

          <div className="sidebar__roles" aria-label="Roles del ecosistema">
            {ROLE_STRIP.map((role) => {
              const isActive = user?.roleCode === role.code;
              const isMuted = Boolean(user?.roleCode) && user.roleCode !== role.code;

              return (
                <span
                  className={`sidebar-role${isActive ? " is-active" : ""}${isMuted ? " is-muted" : ""}`}
                  key={role.code}
                >
                  {role.label}
                </span>
              );
            })}
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Principal">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) => `nav-item${isActive ? " is-active" : ""}`}
              key={item.to}
              onClick={() => {
                if (item.to === "/login") {
                  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, window.location.pathname || "/dashboard");
                }
              }}
              to={item.to}
            >
              <span className="nav-item__icon">{item.icon}</span>
              <span className="nav-item__body">
                <span className="nav-item__label">{item.label}</span>
                <span className="nav-item__caption">{item.caption}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="sidebar__footer">
            <div className="user-card">
              <div className="user-card__avatar" aria-hidden>
                {initials(user.displayName)}
              </div>
              <div>
                <strong>{user.displayName}</strong>
                <small>{user.roleName}</small>
              </div>
            </div>
            <button className="btn btn--ghost btn--block" type="button" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>

      <main className="main">
        <div className="content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
