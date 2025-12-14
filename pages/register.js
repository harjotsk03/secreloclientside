import { useContext, useState } from "react";
import { Key, Mail, RotateCcwKey, User } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { Button } from "../components/buttons/Button";
import Layout from "../components/layouts/Layout";
import { AlertContext, useAlert } from "../context/alertContext";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import * as sodium from "libsodium-wrappers-sumo";
import { useEncryption } from "../context/EncryptionContext";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const router = useRouter();
  const { login } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [decryptionStatus, setDecryptionStatus] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showAlert } = useContext(AlertContext);
  const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
  const { setEncryptionKeys, isSessionKeyReady } = useEncryption();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (firstName === "") {
      setFirstNameError("Missing first name");
      setLoading(false);
      return;
    } else {
      setFirstNameError("");
    }

    if (lastName === "") {
      setLastNameError("Missing last name");
      setLoading(false);
      return;
    } else {
      setLastNameError("");
    }

    if (email === "") {
      setEmailError("Missing email");
      setLoading(false);
      return;
    } else {
      setEmailError("");
    }

    if (password === "") {
      setPasswordError("Missing password");
      setLoading(false);
      return;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setLoading(false);
      return;
    } else {
      setPasswordError("");
    }

    setDecryptionStatus("Creating account...");

    try {
      // Build request body
      const body = {
        full_name: `${firstName} ${lastName}`,
        email,
        password,
      };

      // Send POST request
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      console.log(data);

      if (!data.success) {
        if (data.error == "Email already exists") {
          setError(data.error || "Something went wrong");
          showAlert(
            data.error || "Account already exists, please log in.",
            "error"
          );
          router.push("/login");
        } else {
          setError(data.error || "Something went wrong");
          showAlert(data.error || "Registration failed", "error");
        }
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

      // Registration successful
      showAlert("Account created successfully!", "success");
      router.push("/app/repos");
    } catch (err) {
      console.error(err);
      setError("Failed to register. Please try again.");
      showAlert("Failed to register. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout>
        <div className="w-full h-[85vh] lg:h-[85vh] flex flex-col items-center justify-center fade-in-down">
          <div className="w-full text-center">
            <h1 className="dm-sans-medium text-xl text-black dark:text-white">
              Sign up
            </h1>
            <p className="dm-sans-light text-sm text-center text-stone-400 dark:text-stone-600 mt-1">
              Create your account and company to get started.
            </p>
          </div>

          <form
            onSubmit={handleRegistration}
            className="w-11/12 md:w-1/2 lg:w-1/3 flex flex-col gap-4 lg:gap-6 mt-6 lg:mt-8"
          >
            <div className="flex flex-row gap-2">
              <TextInput
                label="First Name"
                placeholder="First Name"
                value={firstName}
                onChange={setFirstName}
                icon={User}
                error={firstNameError}
              />
              <TextInput
                label="Last Name"
                placeholder="Last Name"
                value={lastName}
                onChange={setLastName}
                icon={User}
                error={lastNameError}
              />
            </div>
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
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              icon={RotateCcwKey}
            />

            <Button size="xl" type="submit" variant="solid" loading={isLoading}>
              {isLoading
                ? decryptionStatus || "Creating account..."
                : "Sign up"}
            </Button>
          </form>
          <button
            onClick={() => router.push("/login")}
            className="text-xs text-black/50 dark:text-stone-500 dm-sans-regular text-center mt-14 w-full"
          >
            Already have an account?{" "}
            <span className="text-black dark:text-stone-300 dm-sans-regular">
              Log In
            </span>
          </button>
        </div>
      </Layout>
    </>
  );
}
