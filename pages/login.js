import { useContext, useEffect, useRef, useState } from "react";
import { Key, Mail } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { Button } from "../components/buttons/Button";
import Layout from "../components/layouts/Layout";
import { AlertContext, useAlert } from "../context/alertContext";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "next/navigation";
import * as sodium from "libsodium-wrappers-sumo";
import { useEncryption } from "../context/EncryptionContext";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [decryptionStatus, setDecryptionStatus] = useState("");
  const { showAlert } = useContext(AlertContext);
  const params = useSearchParams();
  const alertShown = useRef(false);
  const { setEncryptionKeys, isSessionKeyReady } = useEncryption();

  // Get params
  const from = params.get("from");
  const msg = params.get("msg");

  // All hooks MUST come before any conditional returns
  useEffect(() => {
    if (msg && !alertShown.current) {
      alertShown.current = true;
      showAlert(msg, "error");
    }
  }, [msg, showAlert]);

  // NOW we can do conditional rendering
  if (!isSessionKeyReady) {
    return (
      <Layout>
        <div className="w-full h-[85vh] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Initializing security...
          </p>
        </div>
      </Layout>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDecryptionStatus("");

    if (!email || !password) {
      setEmailError(email ? "" : "Missing email");
      setPasswordError(password ? "" : "Missing password");
      setLoading(false);
      return;
    }

    try {
      // Wait for session key to be ready
      if (!isSessionKeyReady) {
        setDecryptionStatus("Initializing security...");
        // Wait up to 5 seconds for session key
        const startTime = Date.now();
        while (!isSessionKeyReady && Date.now() - startTime < 5000) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        if (!isSessionKeyReady) {
          throw new Error(
            "Failed to initialize encryption. Please refresh and try again."
          );
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        showAlert(data.message || "Log in failed", "error");
        setLoading(false);
        return;
      }

      let privateKey = null;
      let publicKey = null;

      // STEP 1: Decrypt keys if encryption data is provided
      if (data.encryption) {
        setDecryptionStatus("Decrypting keys...");

        const worker = new Worker(
          new URL("../workers/decryptionWorker.js", import.meta.url)
        );

        const decryptionPromise = new Promise((resolve, reject) => {
          worker.onmessage = (e) => {
            worker.terminate();
            if (e.data.success) {
              resolve(e.data.privateKey);
            } else {
              reject(new Error(e.data.error));
            }
          };

          worker.onerror = (error) => {
            worker.terminate();
            reject(error);
          };

          worker.postMessage({
            ...data.encryption,
            password,
          });
        });

        const privateKeyB64 = await decryptionPromise;

        // Convert back to Uint8Array
        await sodium.ready;
        privateKey = sodium.from_base64(
          privateKeyB64,
          sodium.base64_variants.ORIGINAL
        );
        publicKey = sodium.from_base64(
          data.encryption.public_key,
          sodium.base64_variants.ORIGINAL
        );

        console.log("🔓 Private key decrypted successfully");
      }

      // STEP 2: Set auth state FIRST (this makes user authenticated)
      setDecryptionStatus("Logging in...");
      login(data.user, data.accessToken, data.refreshToken);

      // STEP 3: THEN set encryption keys (now that user is authenticated)
      if (privateKey && publicKey) {
        try {
          await setEncryptionKeys(publicKey, privateKey);
          console.log("🔐 Encryption keys stored in memory");
        } catch (err) {
          console.error("Failed to store encryption keys:", err);
          showAlert(
            "Failed to initialize encryption. Please try logging in again.",
            "error"
          );
          setLoading(false);
          return;
        }
      }

      showAlert("Logged in successfully!", "success");

      // STEP 4: Navigate to destination
      if (from) router.push(from);
      else router.push("/app/repos");
    } catch (err) {
      console.error(err);
      showAlert(err.message || "Failed to log in. Please try again.", "error");
    } finally {
      setLoading(false);
      setDecryptionStatus("");
    }
  };

  return (
    <Layout>
      <div className="w-full h-[85vh] flex flex-col items-center justify-center fade-in-down">
        <h1 className="dm-sans-medium text-xl text-black dark:text-white">
          Welcome back
        </h1>
        <p className="dm-sans-light text-sm text-center text-stone-400 dark:text-stone-600 mt-1">
          Please log in to continue and access your account.
        </p>

        <form
          onSubmit={handleLogin}
          className="w-11/12 md:w-1/2 lg:w-1/4 flex flex-col gap-6 mt-8"
        >
          <TextInput
            label="Email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            icon={Mail}
            error={emailError}
          />
          <PasswordInput
            label="Password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            icon={Key}
            error={passwordError}
          />

          <Button size="xl" variant="solid" type="submit" loading={isLoading}>
            {isLoading ? decryptionStatus || "Logging in..." : "Log In"}
          </Button>
        </form>
        <button
          onClick={() => router.push("/register")}
          className="text-xs text-black/50 dark:text-stone-500 dm-sans-regular text-center mt-14 w-full"
        >
          Don't have an account?{" "}
          <span className="text-black dark:text-stone-300 dm-sans-regular">
            Register Now
          </span>
        </button>
      </div>
    </Layout>
  );
}
