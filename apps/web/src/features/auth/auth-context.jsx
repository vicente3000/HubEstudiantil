import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { http } from "../../services/http.js";
import { AUTH_TOKEN_STORAGE_KEY } from "../../utils/auth-storage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() =>
    typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? "" : ""
  );
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const loadProfile = useCallback(async (activeToken) => {
    if (!activeToken) {
      setUser(null);
      setStatus("ready");
      return;
    }

    setStatus("loading");

    try {
      const { data } = await http.get("/users/me");
      setUser(data.user);
    } catch {
      setUser(null);
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setTokenState("");
    } finally {
      setStatus("ready");
    }
  }, []);

  useEffect(() => {
    void loadProfile(token);
  }, [token, loadProfile]);

  const setToken = useCallback((next) => {
    if (next) {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, next);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }

    setTokenState(next ?? "");
  }, []);

  const loginWithDevToken = useCallback(
    async (institutionalEmail) => {
      const { data } = await http.post("/auth/dev/token", { institutionalEmail });
      setToken(data.token);
    },
    [setToken]
  );

  const loginWithPassword = useCallback(
    async (institutionalEmail, password) => {
      const { data } = await http.post("/auth/login", { institutionalEmail, password });
      setToken(data.token);
    },
    [setToken]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      loginWithDevToken,
      loginWithPassword,
      logout,
      setToken
    }),
    [token, user, status, loginWithDevToken, loginWithPassword, logout, setToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
