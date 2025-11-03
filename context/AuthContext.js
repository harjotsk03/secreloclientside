import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { AlertContext } from "./alertContext";
import { useEncryption } from "./EncryptionContext";

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
        resetIdleTimer(parsed.accessToken);
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

  const login = async (
    profile,
    accessToken,
    refreshToken,
    privateKey,
    publicKey
  ) => {
    setUser({ profile, accessToken, refreshToken });
    resetIdleTimer(accessToken);

    if (!privateKey || !publicKey) {
      console.warn("Missing encryption keys for this user");
      return;
    }

    // Wait for sodium to be ready
    await sodium.ready;

    // Generate a fresh session key for this session
    const sessionKey = sodium.randombytes_buf(32);
    sessionStorage.setItem(
      "__session_key",
      sodium.to_base64(sessionKey, sodium.base64_variants.ORIGINAL)
    );

    // Encrypt & store the private key backup using the new session key
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const ciphertext = sodium.crypto_secretbox_easy(
      privateKey,
      nonce,
      sessionKey
    );

    const backup = {
      pub: sodium.to_base64(publicKey, sodium.base64_variants.ORIGINAL),
      priv: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
      nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
    };

    sessionStorage.setItem("__enc_backup", JSON.stringify(backup));

    // Set encryption keys in context
    setEncryptionKeys(publicKey, privateKey);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    clearTimeout(timeoutRef.current);
    sessionStorage.removeItem("__session_key");
    showAlert("Logged out", "error");
  };

  const resetIdleTimer = (token = user?.accessToken) => {
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
    if (!user?.accessToken) return;

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

  const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) return null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: refreshToken }),
        }
      );

      if (!res.ok) {
        logout();
        return null;
      }

      const data = await res.json();
      const newAccessToken = data.accessToken;

      setUser((prev) => ({
        ...prev,
        accessToken: newAccessToken,
      }));

      return newAccessToken;
    } catch (err) {
      console.error("Failed to refresh access token", err);
      logout();
      return null;
    }
  };

  async function authFetch(url, options = {}) {
    let token = user?.accessToken;
    if (!token) throw new Error("No access token available");

    const fetchOptions = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      signal: options.signal,
      ...options,
    };

    let res = await fetch(url, fetchOptions);
    let data;

    try {
      data = await res.json();
    } catch {
      data = {};
    }

    // Handle expired token -> try refresh
    if (res.status === 401 && user?.refreshToken) {
      try {
        token = await refreshAccessToken(user.refreshToken);
        if (token) {
          fetchOptions.headers.Authorization = `Bearer ${token}`;
          res = await fetch(url, fetchOptions);

          try {
            data = await res.json();
          } catch {
            data = {};
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        showAlert("Session expired. Please log in again.", "error");
        logout();
        throw refreshError;
      }
    }

    // ✅ Handle error responses
    if (!res.ok) {
      // ✅ Use backend error message if available
      const message =
        data.message || data.error || getDefaultErrorMessage(res.status);

      showAlert(message, "error"); // ✅ Show backend error message

      const error = new Error(message);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // ✅ Helper function for default error messages
  function getDefaultErrorMessage(status) {
    switch (status) {
      case 400:
        return "Bad request — please check your input.";
      case 401:
        return "Session expired or unauthorized. Please log in again.";
      case 403:
        return "You do not have permission to access this resource.";
      case 404:
        return "The requested resource was not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "An unexpected error occurred.";
    }
  }

  async function authPost(url, body = {}, options = {}) {
    // Grab current access token
    let token = user?.accessToken;
    if (!token) throw new Error("No access token available");

    // Build request options
    let fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    };

    let res = await fetch(url, fetchOptions);
    let data = await res.json();

    // If 401, try to refresh token and retry
    if (res.status === 401 && user?.refreshToken) {
      token = await refreshAccessToken(user.refreshToken);
      if (token) {
        fetchOptions.headers.Authorization = `Bearer ${token}`;
        res = await fetch(url, fetchOptions);
        data = await res.json();
      }
    }

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async function authDelete(url, options = {}) {
    // Ensure we have a valid access token
    let token = user?.accessToken;
    if (!token) throw new Error("No access token available");

    // Build request options
    let fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    let res = await fetch(url, fetchOptions);
    let data = await res.json().catch(() => ({})); // handle cases with no JSON body

    // Handle expired access token
    if (res.status === 401 && user?.refreshToken) {
      token = await refreshAccessToken(user.refreshToken);
      if (token) {
        fetchOptions.headers.Authorization = `Bearer ${token}`;
        res = await fetch(url, fetchOptions);
        data = await res.json().catch(() => ({}));
      }
    }

    // Throw on error responses
    if (!res.ok) {
      throw new Error(data.message || "Delete request failed");
    }

    return data;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        authFetch,
        authPost,
        authDelete,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
