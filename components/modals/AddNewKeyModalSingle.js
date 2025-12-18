import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { useRouter } from "next/router";
import { Button } from "../buttons/Button";
import { ArrowLeft } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { PasswordInput } from "../inputs/PasswordInput";
import { useEncryption } from "../../context/EncryptionContext";
import { encryptSecret } from "../../utils/encryptSecret";
import { useAuth } from "../../context/AuthContext";

export default function AddNewKeyModalSingle({
  fetchSecrets,
  setSecrets,
  setShowCreateKeyModal,
  setShowCreateKeyModalSingle,
}) {
  const router = useRouter();
  const { id } = router.query;
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const { user, authFetch, authPost } = useAuth();

  // 🔹 Local state
  const [encryptedData, setEncryptedData] = useState(null);
  const [secret, setSecret] = useState("");
  const [secretName, setSecretName] = useState("");
  const [secretType, setSecretType] = useState("");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);

  // 🔹 Secret type options
  const secretTypeOptions = [
    { label: "API Key", value: "api_key" },
    { label: "OAuth Token", value: "oauth_token" },
    { label: "Client Secret", value: "client_secret" },
    { label: "Database Connection String", value: "db_connection" },
    { label: "SSH Private Key", value: "ssh_key" },
    { label: "Webhook Secret", value: "webhook_secret" },
    { label: "Cloud Storage Keypair", value: "cloud_keypair" },
    { label: "JWT Signing Key", value: "jwt_key" },
    { label: "Custom Secret", value: "custom_secret" },
  ];

  // 🔹 Fetch user IDs & public keys from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/repos/${id}/userKeys`
        );
        const data = await res.data;

        if (Array.isArray(data)) setUsers(data);
        else console.error("Unexpected user data:", data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [id]);

  useEffect(() => {
    const runEncryption = async () => {
      if (!secret || users.length === 0) return;
      try {
        console.log(users);
        const encryptedData = await encryptSecret(secret, users);
        console.log("🔐 Encrypted Hybrid Data:", encryptedData);
        setEncryptedData(encryptedData);
      } catch (err) {
        console.error("Encryption error:", err);
      }
    };
    runEncryption();
  }, [secret, users]);

  // 🔹 Handle Create Secret
  const handleCreateSecret = async () => {
    if (!secretName || !secret || !encryptedData) {
      showAlert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      const body = {
        name: secretName,
        type: secretType,
        description: description || "",
        nonce: encryptedData.secret_nonce,
        encrypted_secret: encryptedData.ciphertext_secret,
        encrypted_keys: encryptedData.encrypted_keys,
        repo_id: id,
      };

      console.log(body);

      const data = await authPost(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/secrets/createSecret`,
        body
      );

      if (data.message == "Secret created successfully.") {
        fetchSecrets();
        showAlert("Secret successfully created!", "success");
        setShowCreateKeyModalSingle(false);
        setShowCreateKeyModal(false);
      } else {
        console.error("Error saving secret:", data);
        showAlert("Failed to create secret.");
      }
    } catch (err) {
      console.error("Encryption or saving error:", err);
      showAlert("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-1/2 xl:w-1/3 px-8 xl:px-12 pt-6 xl:pt-8 pb-8 xl:pb-12 h-max rounded-xl bg-white dark:bg-darkBG"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <button
        onClick={() => {
          setShowCreateKeyModalSingle(false);
          setShowCreateKeyModal(true);
        }}
        className="text black dark:text-white opacity-30 group hover:opacity-90 transition-all duration-500 ease-in-out dm-sans-regular text-xs flex flex-row items-center gap-1"
      >
        <ArrowLeft
          className="group-hover:-translate-x-1 transition-all duration-500"
          size={12}
        />{" "}
        Back
      </button>

      <div className="flex mt-2 flex-col justify-between w-full items-start">
        <div className="flex flex-col">
          <p className="dm-sans-regular text-lg xl:text-xl text-black dark:text-white">
            Adding New Secret
          </p>
        </div>
        <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/30 mt-1 mb-4">
          Secure and add your secret to share with repo members.
        </p>
      </div>

      <div className="flex flex-col gap-2 xl:gap-4 w-full">
        <TextInput
          label="Secret Name"
          required
          placeholder="Secret Name"
          value={secretName}
          onChange={setSecretName}
        />

        <div className="flex flex-col xl:flex-row gap-2 xl:gap-4">
          <Select
            label="Secret Type"
            placeholder="Secret Type"
            options={secretTypeOptions}
            value={secretType}
            onChange={setSecretType}
          />
        </div>

        <TextInput
          multiline
          label="Description"
          placeholder="Description"
          value={description}
          onChange={setDescription}
        />

        <PasswordInput
          label="Secret"
          required
          placeholder="e.g. sk-xxxxxxxxxxxxxxxx"
          onChange={setSecret}
          value={secret}
        />

        <Button
          onClick={handleCreateSecret}
          size="xl"
          variant="solid"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Secret"}
        </Button>
      </div>
    </motion.div>
  );
}
