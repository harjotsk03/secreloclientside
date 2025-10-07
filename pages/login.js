import { useContext, useEffect, useState } from "react";
import { Key, Mail } from "lucide-react";
import { TextInput } from "../components/inputs/TextInput";
import { PasswordInput } from "../components/inputs/PasswordInput";
import { Button } from "../components/buttons/Button";
import Layout from "../components/layouts/Layout";
import { AlertContext, useAlert } from "../context/alertContext";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showAlert } = useContext(AlertContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (email == "") {
      setEmailError("Missing email");
      setLoading(false);
      return;
    } else {
      setEmailError("");
    }
    if (password == "") {
      setPasswordError("Missing password");
      setLoading(false);
      return;
    } else {
      setPasswordError("");
    }

    setLoading(false);
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
            {isLoading ? "Logging in..." : "Log In"}
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
