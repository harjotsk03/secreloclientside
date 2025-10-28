import { createContext, useContext, useState, useEffect, useRef } from "react";
import * as sodium from "libsodium-wrappers-sumo";

const EncryptionContext = createContext();

export function EncryptionProvider({ children }) {
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [sessionKey, setSessionKey] = useState(null);

  const decryptedKeysCache = useRef(new Map());
  const lastActivityRef = useRef(Date.now());
  const timeoutRef = useRef(null);

  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // ===== INITIALIZE sodium and session key =====
  useEffect(() => {
    (async () => {
      await sodium.ready;

      const existingKey = sessionStorage.getItem("__session_key");
      if (existingKey) {
        setSessionKey(
          sodium.from_base64(existingKey, sodium.base64_variants.ORIGINAL)
        );
        console.log("🧩 Restored existing session key");
      } else {
        const key = sodium.randombytes_buf(32);
        setSessionKey(key);
        sessionStorage.setItem(
          "__session_key",
          sodium.to_base64(key, sodium.base64_variants.ORIGINAL)
        );
        console.log("🧩 New session key generated");
      }
    })();
  }, []);


  // ===== RESTORE KEYS FROM SESSION =====
  useEffect(() => {
    (async () => {
      if (!sessionKey) return; // wait for key ready
      const backup = sessionStorage.getItem("__enc_backup");
      if (!backup) return;

      try {
        await sodium.ready;
        const data = JSON.parse(backup);
        const pubKey = sodium.from_base64(
          data.pub,
          sodium.base64_variants.ORIGINAL
        );
        const nonce = sodium.from_base64(
          data.nonce,
          sodium.base64_variants.ORIGINAL
        );
        const ciphertext = sodium.from_base64(
          data.priv,
          sodium.base64_variants.ORIGINAL
        );

        const privKey = sodium.crypto_secretbox_open_easy(
          ciphertext,
          nonce,
          sessionKey
        );

        if (privKey) {
          setPublicKey(pubKey);
          setPrivateKey(privKey);
          setIsUnlocked(true);
          console.log("🔐 Session keys restored from sessionStorage");
        }
      } catch (err) {
        console.warn("❌ Failed to restore session keys", err);
      }
    })();
  }, [sessionKey]);

  const updateActivity = () => (lastActivityRef.current = Date.now());

  // ===== SET KEYS AND BACKUP =====
  const setEncryptionKeys = async (pubKey, privKey) => {
    await sodium.ready;
    setPublicKey(pubKey);
    setPrivateKey(privKey);
    setIsUnlocked(true);
    updateActivity();

    console.log("🔐 Encryption keys loaded into memory");

    // Encrypt and store in sessionStorage
    if (sessionKey) {
      const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
      const ciphertext = sodium.crypto_secretbox_easy(
        privKey,
        nonce,
        sessionKey
      );

      const backup = {
        pub: sodium.to_base64(pubKey, sodium.base64_variants.ORIGINAL),
        priv: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
        nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
      };

      sessionStorage.setItem("__enc_backup", JSON.stringify(backup));
      sessionStorage.setItem("__pk_backup", "true");

      console.log("💾 Session backup stored securely");
    }
  };

  const clearEncryptionKeys = () => {
    setPublicKey(null);
    setPrivateKey(null);
    setIsUnlocked(false);
    decryptedKeysCache.current.clear();
    sessionStorage.removeItem("__enc_backup");
    sessionStorage.removeItem("__pk_backup");
    console.log("🗑️ Encryption keys cleared from memory");
  };

  // ===== AUTO-LOCK & ACTIVITY TRACKING =====
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleActivity = () => {
      if (isUnlocked) updateActivity();
    };
    ["mousedown", "keydown", "scroll", "touchstart", "click"].forEach((evt) =>
      document.addEventListener(evt, handleActivity)
    );

    timeoutRef.current = setInterval(() => {
      if (isUnlocked) {
        const idle = Date.now() - lastActivityRef.current;
        if (idle > INACTIVITY_TIMEOUT) {
          console.log("⏰ Session timed out due to inactivity");
          clearEncryptionKeys();
          window.dispatchEvent(new CustomEvent("encryption-session-timeout"));
        }
      }
    }, 60000);

    return () => {
      ["mousedown", "keydown", "scroll", "touchstart", "click"].forEach((evt) =>
        document.removeEventListener(evt, handleActivity)
      );
      clearInterval(timeoutRef.current);
    };
  }, [isUnlocked]);

  // ===== PUBLIC VALUE =====
  const value = {
    publicKey,
    privateKey,
    isUnlocked,
    setEncryptionKeys,
    clearEncryptionKeys,
    updateActivity,
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context)
    throw new Error("useEncryption must be used within EncryptionProvider");
  return context;
}
