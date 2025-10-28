import { useEffect } from "react";
import { useEncryption } from "../context/EncryptionContext";
import sodium from "libsodium-wrappers-sumo"; // Changed to sumo

export function SecretDecrypter({
  encryptedSecret,
  nonceB64,
  senderPublicKey,
}) {
  const { keys } = useEncryption();

  useEffect(() => {
    const decryptSecret = async () => {
      if (!keys?.privateKey) return;

      await sodium.ready;
      const nonce = sodium.from_base64(
        nonceB64,
        sodium.base64_variants.ORIGINAL
      );
      const secretCipher = sodium.from_base64(
        encryptedSecret,
        sodium.base64_variants.ORIGINAL
      );

      const plaintext = sodium.crypto_box_open_easy(
        secretCipher,
        nonce,
        senderPublicKey,
        keys.privateKey
      );
      console.log("Decrypted secret:", sodium.to_string(plaintext));
    };
    decryptSecret();
  }, [keys, encryptedSecret, nonceB64, senderPublicKey]);

  return null;
}
