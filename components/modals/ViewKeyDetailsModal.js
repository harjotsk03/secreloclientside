import { AnimatePresence, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { Button } from "../buttons/Button";
import { KeySquare, FileText, Edit2, X, Copy, Eye, Check } from "lucide-react";
import { TextInput } from "../inputs/TextInput";
import { Select } from "../inputs/Select";
import { useAuth } from "../../context/AuthContext";
import { useEncryption } from "../../context/EncryptionContext";
import { decryptSecret } from "../../utils/decryptSecret";
import { reEncryptSecret } from "../../utils/reEncryptSecret";
import * as sodium from "libsodium-wrappers-sumo";

export default function ViewKeyDetailsModal({
  setSecrets,
  keyData,
  currentMember,
  repoUsers,
  setShowKeyDetailsModal,
}) {
  const { showAlert } = useContext(AlertContext);
  const [formData, setFormData] = useState({
    name: keyData.name,
    description: keyData.description,
    type: keyData.type,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authDelete, authPut } = useAuth();
  const { privateKey } = useEncryption();
  const [revealSecret, setRevealSecret] = useState(false);
  const [decryptedSecret, setDecryptedSecret] = useState("");
  const [editedSecret, setEditedSecret] = useState(""); // NEW: Track edited secret value
  const [secretChanged, setSecretChanged] = useState(false); // NEW: Track if secret value changed

  const handleRevealSecret = async () => {
    if (revealSecret) {
      setRevealSecret(false);
      setDecryptedSecret("");
      return;
    }

    if (!privateKey) return showAlert("Private key not loaded", "error");

    try {
      await sodium.ready;

      const dek = await decryptSecret(
        privateKey,
        keyData.encrypted_secret_key,
        keyData.user_nonce,
        keyData.sender_public_key
      );

      const secretNonce = sodium.from_base64(
        keyData.secret_nonce,
        sodium.base64_variants.ORIGINAL
      );
      const ciphertextSecret = sodium.from_base64(
        keyData.encrypted_secret,
        sodium.base64_variants.ORIGINAL
      );

      const decryptedBytes = sodium.crypto_secretbox_open_easy(
        ciphertextSecret,
        secretNonce,
        dek
      );

      const finalSecret = sodium.to_string(decryptedBytes);
      setDecryptedSecret(finalSecret);
      setEditedSecret(finalSecret); // Initialize edited secret
      setRevealSecret(true);

      dek.fill(0);
    } catch (err) {
      console.error(err);
      showAlert("Failed to decrypt secret", "error");
    }
  };

  useEffect(() => {
    // Check if metadata changed
    const metadataChanged =
      formData.name !== keyData.name ||
      formData.description !== keyData.description ||
      formData.type !== keyData.type;

    setIsDirty(metadataChanged || secretChanged);
  }, [formData, keyData, secretChanged]);

  // NEW: Track if secret value changed
  useEffect(() => {
    if (isEditMode && revealSecret) {
      setSecretChanged(editedSecret !== decryptedSecret);
    }
  }, [editedSecret, decryptedSecret, isEditMode, revealSecret]);

  function formatDateTime(isoString) {
    if (!isoString) return "Unknown";
    const date = new Date(isoString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString(undefined, options).replace(",", " at");
  }

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

  const handleEdit = async () => {
    setIsEditMode(true);
    // Auto-reveal secret when entering edit mode
    if (!revealSecret) {
      await handleRevealSecret();
    }
  };

  const handleCancel = () => {
    setFormData({
      name: keyData.name,
      description: keyData.description,
      type: keyData.type,
    });
    setEditedSecret(decryptedSecret); // Reset edited secret
    setSecretChanged(false);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!isDirty) return;

    setLoading(true);

    try {
      // Check if secret value changed
      if (secretChanged) {
        // SECRET VALUE CHANGED - use /value endpoint

        if (!repoUsers || repoUsers.length === 0) {
          throw new Error("Repository users not loaded");
        }

        // Re-encrypt secret with new DEK for all users
        const { encrypted_secret, nonce, encrypted_keys } =
          await reEncryptSecret(editedSecret, repoUsers);

        const body = {
          encrypted_secret,
          nonce,
          encrypted_keys,
          name: formData.name,
          description: formData.description,
          type: formData.type,
        };

        const response = await authPut(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/secrets/${keyData.id}/value`,
          body
        );

        showAlert("Secret updated successfully!", "success");

        // Update local state
        setSecrets((prev) =>
          prev.map((secret) =>
            secret.id === keyData.id
              ? { ...secret, ...response.secret }
              : secret
          )
        );

        window.location.reload();
      } else {
        // METADATA ONLY CHANGED - use /metadata endpoint

        const body = {
          name: formData.name,
          description: formData.description,
          type: formData.type,
        };

        const response = await authPut(
          `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/secrets/${keyData.id}/metadata`,
          body
        );

        showAlert("Secret metadata updated successfully!", "success");

        // Update local state
        setSecrets((prev) =>
          prev.map((secret) =>
            secret.id === keyData.id
              ? { ...secret, ...response.secret }
              : secret
          )
        );
      }

      setIsEditMode(false);
      setSecretChanged(false);
      setShowKeyDetailsModal(false); // Close modal after save
    } catch (err) {
      console.error("Error updating secret:", err);
      showAlert(err.message || "Failed to update secret", "error");
    } finally {
      setLoading(false);
    }
  };

  async function handleCopySecret() {
    if (!privateKey) {
      showAlert("Private key not loaded", "error");
      return;
    }

    try {
      await sodium.ready;

      const dek = await decryptSecret(
        privateKey,
        keyData.encrypted_secret_key,
        keyData.user_nonce,
        keyData.sender_public_key
      );

      const secretNonce = sodium.from_base64(
        keyData.secret_nonce,
        sodium.base64_variants.ORIGINAL
      );
      const ciphertextSecret = sodium.from_base64(
        keyData.encrypted_secret,
        sodium.base64_variants.ORIGINAL
      );

      const decryptedBytes = sodium.crypto_secretbox_open_easy(
        ciphertextSecret,
        secretNonce,
        dek
      );
      const finalSecret = sodium.to_string(decryptedBytes);

      await navigator.clipboard.writeText(finalSecret);
      showAlert("Secret copied to clipboard", "success");

      dek.fill(0);
    } catch (err) {
      console.error("Decryption or copy failed:", err);
      showAlert("Failed to copy secret to clipboard", "error");
    }
  }

  const handleDelete = async () => {
    try {
      const res = await authDelete(
        `${process.env.NEXT_PUBLIC_API_URL}/secreloapis/v1/secrets/${keyData.id}`
      );
      console.log(res);
      showAlert("Secret deleted successfully!", "success");
      setSecrets((prev) => prev.filter((secret) => secret.id !== keyData.id));
      setShowDeleteConfirm(false);
      setShowKeyDetailsModal(false);
    } catch (err) {
      console.error("Error deleting secret:", err);
      showAlert("Failed to delete secret", "error");
    }
  };

  return (
    <motion.div
      className="relative z-50 w-11/12 lg:w-2/3 px-8 lg:px-12 pt-6 lg:pt-8 pb-8 lg:pb-12 h-max rounded-xl bg-white dark:bg-darkBG"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="dm-sans-regular text-lg lg:text-xl text-black dark:text-white">
            {isEditMode ? "Editing" : "Viewing"} Secret - {keyData.name}
          </p>
          <p className="dm-sans-light text-xs lg:text-sm text-black/50 dark:text-white/50 mt-1">
            <span className="text-black dark:text-white">Current Version:</span>{" "}
            {keyData.version}
          </p>
          <div className="flex flex-col lg:flex-row gap-4 items-center mt-0.5 mb-3">
            <p className="dm-sans-light text-xs lg:text-xs text-black/50 dark:text-white/50">
              <span className="text-black dark:text-white">Last Modified:</span>{" "}
              {keyData.updated_by_name} - {formatDateTime(keyData.updated_at)}
            </p>
            <p className="dm-sans-light text-xs lg:text-xs text-black/50 dark:text-white/50">
              <span className="text-black dark:text-white">Created:</span>{" "}
              {keyData.created_by_name} - {formatDateTime(keyData.created_at)}
            </p>
          </div>
        </div>

        {(currentMember?.member_permissions === "owner" ||
          currentMember?.member_permissions === "admin") && (
          <div className="flex gap-2">
            {!isEditMode ? (
              <Button variant="secondary" size="sm" onClick={handleEdit}>
                Edit
              </Button>
            ) : (
              <>
                <motion.div
                  animate={{
                    opacity: isDirty ? 1 : 0.6,
                    scale: isDirty ? 1 : 0.97,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="solid"
                    size="sm"
                    disabled={!isDirty || loading}
                    loading={loading}
                    onClick={handleSave}
                    icon={Check}
                  >
                    {secretChanged ? "Save (New DEKs)" : "Save"}
                  </Button>
                </motion.div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={loading}
                  icon={X}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col lg:flex-row lg:gap-3">
          <TextInput
            label="Key Name"
            placeholder="Key Name"
            value={formData.name}
            icon={KeySquare}
            disabled={!isEditMode}
            onChange={(val) => setFormData({ ...formData, name: val })}
          />
          <Select
            label="Secret Type"
            required={true}
            placeholder="Secret Type"
            icon={KeySquare}
            options={secretTypeOptions}
            value={formData.type}
            disabled={!isEditMode}
            onChange={(val) => setFormData({ ...formData, type: val })}
          />
        </div>

        <TextInput
          multiline={true}
          label="Description"
          placeholder="Description"
          value={formData.description}
          icon={FileText}
          disabled={!isEditMode}
          onChange={(val) => setFormData({ ...formData, description: val })}
        />

        <div className="flex flex-row gap-2 items-end justify-center">
          <div className="w-full space-y-1.5">
            <label
              className={`block text-xs lg:text-sm dm-sans-regular ${
                !isEditMode
                  ? "text-black/50 dark:text-white/50"
                  : "text-black dark:text-white"
              }`}
            >
              Secret{" "}
              {secretChanged && (
                <span className="text-amber-600">(Modified)</span>
              )}
            </label>
            <input
              type={revealSecret ? "text" : "password"}
              className={`
            w-full px-5 py-2 h-10 text-sm rounded-lg dm-sans-regular text-black bg-white dark:bg-darkBG3 dark:text-white transition-colors border border-stone-200 dark:border-stone-800 focus:border-black focus:dark:border-stone-500 focus:ring-transparent focus:outline-none focus:ring-0 pl-3
            ${!isEditMode ? "opacity-40 cursor-not-allowed" : ""}
            ${secretChanged ? "border-amber-600 dark:border-amber-600" : ""}
          `}
              placeholder=""
              value={
                revealSecret
                  ? isEditMode
                    ? editedSecret
                    : decryptedSecret
                  : "••••••••••••••••"
              }
              onChange={(e) => {
                if (isEditMode) {
                  setEditedSecret(e.target.value);
                }
              }}
              disabled={!isEditMode}
            />
          </div>

          {!isEditMode && (
            <div className="flex flex-row gap-2">
              <Button
                variant="secondary"
                size="xl"
                onClick={handleRevealSecret}
              >
                {revealSecret ? "Hide" : "Reveal"}
              </Button>
              <Button
                variant="primary"
                size="xl"
                onClick={handleCopySecret}
                icon={Copy}
              ></Button>
            </div>
          )}
        </div>

        {(currentMember?.member_permissions === "owner" ||
          currentMember?.member_permissions === "admin") &&
          !isEditMode && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete
            </Button>
          )}
      </div>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowDeleteConfirm(false)}
            />

            <motion.div
              className="relative z-50 bg-white dark:bg-darkBG rounded-xl p-8 w-11/12 max-w-md shadow-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <p className="dm-sans-regular text-lg text-black dark:text-white mb-2">
                Confirm Delete
              </p>
              <p className="dm-sans-light text-sm text-black/70 dark:text-white/50 mb-6">
                Are you sure you want to delete <strong>{keyData.name}</strong>?
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
