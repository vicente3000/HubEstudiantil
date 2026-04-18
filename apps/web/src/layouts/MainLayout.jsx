import { NavLink, Outlet } from "react-router-dom";
import { appMeta, navigationItems } from "../utils/constants.js";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__eyebrow">Proyecto</span>
          <strong>{appMeta.name}</strong>
          <small>{appMeta.subtitle}</small>
        </div>

        <nav className="sidebar__nav">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) => `sidebar__link${isActive ? " is-active" : ""}`}
              key={item.to}
              to={item.to}
            >
              <span>{item.label}</span>
              <small>{item.caption}</small>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
