import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { AlertContext } from "./alertContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null); // { profile, token }
  const [loading, setLoading] = useState(true); // new loading state
  const timeoutRef = useRef(null);
  const { showAlert } = useContext(AlertContext);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserState(parsed);
        resetIdleTimer(parsed.token);
      } catch (err) {
        console.error("Failed to parse stored user", err);
        localStorage.removeItem("user");
      }
    }
    setLoading(false); // done loading
  }, []);

  // Internal function to update state + localStorage together
  const setUser = (newUser) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
      localStorage.setItem("logout", Date.now()); // sync across tabs
    }
  };

  const login = (profile, token) => {
    setUser({ profile, token });
    resetIdleTimer(token);
  };

  const logout = () => {
    setUser(null);
    clearTimeout(timeoutRef.current);
    showAlert("Logged out", "error");
  };

  const resetIdleTimer = (token = user?.token) => {
    if (!token) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      logout();
      showAlert(
        "Session expired due to inactivity. Please log in again.",
        "error"
      );
    }, 5 * 60 * 1000); // 5 min idle
  };

  // Listen to user activity to reset the idle timer
  useEffect(() => {
    if (!user?.token) return;

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    const handleActivity = () => resetIdleTimer();

    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetIdleTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimeout(timeoutRef.current);
    };
  }, [user]);

  // Listen for logout events from other tabs
  useEffect(() => {
    const syncLogout = (e) => {
      if (e.key === "logout") {
        setUserState(null);
        clearTimeout(timeoutRef.current);
      }
    };
    window.addEventListener("storage", syncLogout);
    return () => window.removeEventListener("storage", syncLogout);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
