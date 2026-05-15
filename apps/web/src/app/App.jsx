import { AppProviders } from "./providers.jsx";
import { AppRoutes } from "../routes/index.jsx";

export default function App() {
  return (
    <div className="app-root">
      <div className="bg-orb bg-orb--1" aria-hidden />
      <div className="bg-orb bg-orb--2" aria-hidden />
      <div className="bg-grid" aria-hidden />
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </div>
  );
}
