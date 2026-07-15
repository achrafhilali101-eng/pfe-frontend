import { createContext, useContext, useEffect, useState } from "react";
import { api, setToken, clearToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    api
      .me()
      .then((me) => {
        setUser(me);
        window.dispatchEvent(new CustomEvent("user-changed", { detail: me.id }));
      })
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email, password) {
    const { access_token } = await api.login({ email, password });
    setToken(access_token);
    const me = await api.me();
    setUser(me);
    window.dispatchEvent(new CustomEvent("user-changed", { detail: me.id }));
    return me;
  }

  async function register(payload) {
    const { access_token } = await api.register(payload);
    setToken(access_token);
    const me = await api.me();
    setUser(me);
    window.dispatchEvent(new CustomEvent("user-changed", { detail: me.id }));
    return me;
  }

  function logout() {
    clearToken();
    setUser(null);
    window.dispatchEvent(new CustomEvent("user-changed", { detail: null }));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  return ctx;
}
