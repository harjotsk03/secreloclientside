"use client";
import { AnimatePresence, motion } from "framer-motion";
import Toast from "../components/general/Toast";
import { ThemeProvider } from "../context/ThemeContext";
import { AlertProvider } from "../context/alertContext";
import "../styles/globals.css";
import { useContext, useEffect, useState } from "react";

function AppContent({ Component, pageProps }) {
  const [organizationId, setOrganizationId] = useState("");
  const [roleId, setRoleId] = useState("");

  return (
    <>
      <Toast />
      <Component {...pageProps} />
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
      <ThemeProvider>
        <AlertProvider>
          <AppContent Component={Component} pageProps={pageProps} />
        </AlertProvider>
      </ThemeProvider>
  );
}

export default MyApp;
