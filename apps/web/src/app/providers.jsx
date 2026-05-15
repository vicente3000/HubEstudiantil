import { AuthProvider } from "../features/auth/auth-context.jsx";

export function AppProviders({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
