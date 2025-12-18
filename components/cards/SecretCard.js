import { BookText, Copy } from "lucide-react";
import { Button } from "../../components/buttons/Button";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatSecretType } from "../../utils/formatSecretType";
import { decryptSecret } from "../../utils/decryptSecret";
import * as sodium from "libsodium-wrappers-sumo";
import { useEncryption } from "../../context/EncryptionContext";
import { AlertContext } from "../../context/alertContext";
import { useContext } from "react";

export default function SecretCard({
  secret,
  setActiveKey,
  setShowKeyDetailsModal,
  currentMember,
}) {
  const { showAlert } = useContext(AlertContext);
  const { privateKey } = useEncryption();
  async function handleCopy() {
    if (!privateKey) {
      showAlert("Private key not loaded", "error");
      return;
    }

    try {
      await sodium.ready;

      // 1️⃣ Decrypt DEK for single-user secret
      const dek = await decryptSecret(
        privateKey,
        secret.encrypted_secret_key,
        secret.user_nonce,
        secret.sender_public_key
      );

      // 2️⃣ Decrypt main secret
      const secretNonce = sodium.from_base64(
        secret.secret_nonce,
        sodium.base64_variants.ORIGINAL
      );
      const ciphertextSecret = sodium.from_base64(
        secret.encrypted_secret,
        sodium.base64_variants.ORIGINAL
      );

      const decryptedBytes = sodium.crypto_secretbox_open_easy(
        ciphertextSecret,
        secretNonce,
        dek
      );
      const finalSecret = sodium.to_string(decryptedBytes);

      // 3️⃣ Copy to clipboard
      await navigator.clipboard.writeText(finalSecret);
      showAlert("Secret copied to clipboard", "success");

      // 4️⃣ Wipe sensitive data
      dek.fill(0);
    } catch (err) {
      console.error("Decryption or copy failed:", err);
      showAlert("Failed to copy secret to clipboard", "error");
    }
  }

  return (
    <div
      key={secret.id}
      className={`flex text-left px-6 py-4 bg-stone-100/80 dark:bg-stone-800/80 group justify-between rounded-xl transition-all duration-500`}
    >
      <div>
        <p className="text-base dm-sans-semibold text-black dark:text-white">
          {secret.name}{" "}
          {secret.type != "" && (
            <span className="text-xs dm-sans-light text-green-700 dark:text-white mt-1">
              ({formatSecretType(secret.type)})
            </span>
          )}
        </p>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
          {secret.description}
        </p>
        <div className="mt-2 text-xs text-stone-400/80 dark:text-stone-400 flex flex-row gap-2">
          <p>
            Last updated: {formatDateTime(secret.updated_at)} by{" "}
            {secret.updated_by_name}
          </p>
          <p>-</p>
          <p>Version: {secret.version}</p>
        </div>
      </div>

      {currentMember?.status === "active" && (
        <div className="flex flex-row justify-between gap-2 items-start">
          <Button size="sm" variant="ghost" icon={Copy} onClick={handleCopy} />
          <Button
            onClick={() => {
              setActiveKey(secret);
              setShowKeyDetailsModal(true);
            }}
            size="sm"
          >
            View
          </Button>
        </div>
      )}
    </div>
  );
}
