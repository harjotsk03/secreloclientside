import * as sodium from "libsodium-wrappers-sumo";

/**
 * Decrypt an encrypted message (DEK) using recipient's private key.
 *
 * @param {Uint8Array} recipientPrivateKey - Recipient's private key.
 * @param {string} ciphertext - Base64 encoded ciphertext.
 * @param {string} nonce - Base64 encoded nonce used for encryption.
 * @param {string} senderPublicKey - Base64 encoded ephemeral sender public key.
 * @returns {Promise<Uint8Array>} - Decrypted bytes (raw data).
 */
export async function decryptSecret(
  recipientPrivateKey,
  ciphertext,
  nonce,
  senderPublicKey
) {
  await sodium.ready;

  const recipientPrivateKeyBytes =
    recipientPrivateKey instanceof Uint8Array
      ? recipientPrivateKey
      : new Uint8Array(recipientPrivateKey);

  const ciphertextBytes = sodium.from_base64(
    ciphertext,
    sodium.base64_variants.ORIGINAL
  );
  const nonceBytes = sodium.from_base64(nonce, sodium.base64_variants.ORIGINAL);
  const senderPubKeyBytes = sodium.from_base64(
    senderPublicKey,
    sodium.base64_variants.ORIGINAL
  );

  const decrypted = sodium.crypto_box_open_easy(
    ciphertextBytes,
    nonceBytes,
    senderPubKeyBytes,
    recipientPrivateKeyBytes
  );

  return decrypted; // <-- raw bytes (Uint8Array)
}
