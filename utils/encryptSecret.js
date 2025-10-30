import * as sodium from "libsodium-wrappers-sumo";

/**
 * Hybrid encryption: Encrypts a secret with a symmetric key (DEK),
 * then encrypts that DEK with each user's public key.
 *
 * @param {string} secret - The plaintext secret to encrypt.
 * @param {Array<{ user_id: string, public_key: string | Uint8Array }>} recipients - Array of user objects.
 * @returns {Promise<{
 *   ciphertext_secret: string,
 *   secret_nonce: string,
 *   encrypted_keys: Array<{ user_id: string, encrypted_key: string, nonce: string, sender_public_key: string }>
 * }>}
 */
export async function encryptSecret(secret, recipients) {
  await sodium.ready;

  // 1️⃣ Generate a random symmetric DEK (Data Encryption Key)
  const dek = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);

  // 2️⃣ Encrypt the secret using the DEK
  const secretNonce = sodium.randombytes_buf(
    sodium.crypto_secretbox_NONCEBYTES
  );
  const ciphertextSecret = sodium.crypto_secretbox_easy(
    sodium.from_string(secret),
    secretNonce,
    dek
  );

  // 3️⃣ For each recipient, encrypt the DEK using their public key
  const encryptedKeys = await Promise.all(
    recipients.map(async ({ user_id, public_key }) => {
      const pubKeyBytes =
        public_key instanceof Uint8Array
          ? public_key
          : sodium.from_base64(public_key, sodium.base64_variants.ORIGINAL);

      const ephemeralKeyPair = sodium.crypto_box_keypair();
      const keyNonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

      const encryptedKey = sodium.crypto_box_easy(
        dek,
        keyNonce,
        pubKeyBytes,
        ephemeralKeyPair.privateKey
      );

      return {
        user_id,
        encrypted_key: sodium.to_base64(
          encryptedKey,
          sodium.base64_variants.ORIGINAL
        ),
        nonce: sodium.to_base64(keyNonce, sodium.base64_variants.ORIGINAL),
        sender_public_key: sodium.to_base64(
          ephemeralKeyPair.publicKey,
          sodium.base64_variants.ORIGINAL
        ),
      };
    })
  );

  // 4️⃣ Return everything needed for storage / distribution
  return {
    ciphertext_secret: sodium.to_base64(
      ciphertextSecret,
      sodium.base64_variants.ORIGINAL
    ),
    secret_nonce: sodium.to_base64(
      secretNonce,
      sodium.base64_variants.ORIGINAL
    ),
    encrypted_keys: encryptedKeys,
  };
}
