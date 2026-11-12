import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getAuthStatus, logout, type AuthAccount } from "./api";

const storageKey = "edu-compass.auth-state.v1";
type Status = "loading" | "authenticated" | "unauthenticated";
type AuthContextValue = {
  status: Status;
  account?: AuthAccount;
  sessionExpired: boolean;
  refresh: () => Promise<boolean>;
  setAuthenticated: (account: AuthAccount) => void;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

const rememberedAccount = () => {
  try {
    const value = JSON.parse(window.localStorage.getItem(storageKey) || "null") as { email?: unknown } | null;
    return typeof value?.email === "string" ? value.email : undefined;
  } catch {
    return undefined;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [account, setAccount] = useState<AuthAccount>();
  const [sessionExpired, setSessionExpired] = useState(false);

  const refresh = async () => {
    const hadSession = Boolean(rememberedAccount());
    try {
      const result = await getAuthStatus();
      if (result.authenticated && result.account) {
        setAccount(result.account);
        setStatus("authenticated");
        setSessionExpired(false);
        window.localStorage.setItem(storageKey, JSON.stringify({ email: result.account.email }));
        return true;
      }
      setAccount(undefined);
      setStatus("unauthenticated");
      setSessionExpired(hadSession);
      window.localStorage.removeItem(storageKey);
      return false;
    } catch {
      setAccount(undefined);
      setStatus("unauthenticated");
      setSessionExpired(hadSession);
      window.localStorage.removeItem(storageKey);
      return false;
    }
  };

  useEffect(() => { void refresh(); }, []);
  const value = useMemo<AuthContextValue>(() => ({
    status,
    account,
    sessionExpired,
    refresh,
    setAuthenticated: (nextAccount) => {
      setAccount(nextAccount);
      setStatus("authenticated");
      setSessionExpired(false);
      window.localStorage.setItem(storageKey, JSON.stringify({ email: nextAccount.email }));
    },
    signOut: async () => {
      await logout();
      setAccount(undefined);
      setStatus("unauthenticated");
      setSessionExpired(false);
      window.localStorage.removeItem(storageKey);
    },
  }), [status, account, sessionExpired]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
