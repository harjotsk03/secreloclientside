// components/layouts/AuthLayout.js
"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Nav from "../nav/Nav";
import { AlertContext } from "../../context/alertContext";
import { useAuth } from "../../context/AuthContext";
import { useEncryption } from "../../context/EncryptionContext";

export default function AuthLayout({ children }) {
  const redirecting = useRef(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSideNav, setShowSideNav] = useState(false);
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [isRestoringSession, setIsRestoringSession] = useState(true); // NEW

  const { showAlert } = useContext(AlertContext);
  const { user, logout, loading, setUser } = useAuth();
  const { isUnlocked } = useEncryption();
  const router = useRouter();
  const pathname = usePathname();

  const redirectToLogin = (msg) => {
    const params = new URLSearchParams();
    if (msg) params.set("msg", msg);
    params.set("from", pathname);
    router.push(`/login?${params.toString()}`);
  };

  // ===== ENCRYPTION SESSION CHECK =====
  useEffect(() => {
    // Listen for session timeout events from EncryptionContext
    const handleSessionTimeout = () => {
      showAlert("Your session has been locked due to inactivity.", "warning");
      setShowReauthModal(true);
    };

    window.addEventListener("encryption-session-timeout", handleSessionTimeout);

    return () => {
      window.removeEventListener(
        "encryption-session-timeout",
        handleSessionTimeout
      );
    };
  }, [showAlert]);

  // ===== WAIT FOR SESSION RESTORATION =====
  useEffect(() => {
    if (!loading && user?.accessToken) {
      const hasBackup = sessionStorage.getItem("__pk_backup");

      if (hasBackup && !isUnlocked) {
        // Give the EncryptionContext time to restore keys from sessionStorage
        const timeout = setTimeout(() => {
          setIsRestoringSession(false);

          // If still not unlocked after waiting, show reauth modal
          if (!isUnlocked) {
            console.log(
              "🔒 Session restoration timeout - showing re-auth modal"
            );
            showAlert(
              "Your session has been locked due to inactivity.",
              "warning"
            );
            logout();
          }
        }, 500); // Wait 500ms for restoration

        return () => clearTimeout(timeout);
      } else if (!hasBackup && !isUnlocked) {
        // No backup exists, session fully expired
        console.log("🔒 No session backup - redirecting to login");
        setIsRestoringSession(false);
        redirecting.current = true;
        logout();
        redirectToLogin("Session expired. Please log in again.");
      } else if (isUnlocked) {
        // Keys are unlocked, all good
        setIsRestoringSession(false);
      }
    }
  }, [loading, user?.accessToken, isUnlocked, logout]);

  // ===== JWT TOKEN CHECK =====
  useEffect(() => {
    if (loading) return;

    const accessToken = user?.accessToken;

    if (!accessToken && !redirecting.current) {
      redirecting.current = true;
      redirectToLogin("Please log in to continue");
      return;
    }

    const refreshAccessToken = async (refreshToken) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: refreshToken }),
          }
        );

        if (!res.ok) throw new Error("Failed to refresh token");

        const data = await res.json();
        const newAccessToken = data.accessToken;

        setUser((prev) => ({
          ...prev,
          accessToken: newAccessToken,
        }));

        return newAccessToken;
      } catch (err) {
        logout();
        return null;
      }
    };

    if (accessToken && !redirecting.current) {
      try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const now = Date.now() / 1000;

        if (payload.exp && payload.exp < now) {
          // Token expired — try to refresh
          refreshAccessToken(user.refreshToken)
            .then((newToken) => {
              if (!newToken) {
                redirecting.current = true;
                logout();
                redirectToLogin("Session expired. Please log in again.");
              }
            })
            .catch(() => {
              redirecting.current = true;
              logout();
              redirectToLogin("Session expired. Please log in again.");
            });
        }
      } catch (err) {
        console.error("Invalid token", err);
        redirecting.current = true;
        logout();
        redirectToLogin();
      }
    }
  }, [user, loading, router, logout, setUser]);

  // ===== SIDEBAR LOCALSTORAGE =====
  useEffect(() => {
    const storedSidebar = localStorage.getItem("sidebarOpen");
    if (storedSidebar !== null) setSidebarOpen(storedSidebar === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen.toString());
  }, [sidebarOpen]);

  // Show loading while restoring session
  if (loading || isRestoringSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user?.accessToken) return null;

  return (
    <div className="transition-all duration-300 ease-in-out">
      <Nav
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showSideNav={showSideNav}
        setShowSideNav={setShowSideNav}
      />
      <main
        className={`transition-all min-h-screen duration-300 flex-1 fade-in-down px-4 lg:px-0 lg:mr-8${
          sidebarOpen
            ? `ml-0 ${showSideNav ? "lg:ml-20" : "lg:ml-4"} lg:pl-2`
            : "ml-0 lg:ml-80 pl-0 lg:pl-6"
        }`}
      >
        <div className="pt-20 lg:pr-6 lg:mt-0 lg:pt-20">{children}</div>
      </main>
    </div>
  );
}
