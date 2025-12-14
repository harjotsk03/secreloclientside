import * as sodium from "libsodium-wrappers-sumo";

/**
 * Re-encrypt a secret with a new DEK for all users in the repo
 *
 * @param {string} newSecretValue - The new plaintext secret value
 * @param {Array} currentMember - Array of user objects with public_key
 * @returns {Promise<{ encrypted_secret, nonce, encrypted_keys }>}
 */
export async function reEncryptSecret(newSecretValue, currentMember) {
  await sodium.ready;

  // 1️⃣ Generate new DEK
  const dek = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);

  // 2️⃣ Encrypt the secret with the new DEK
  const secretNonce = sodium.randombytes_buf(
    sodium.crypto_secretbox_NONCEBYTES
  );
  const encryptedSecret = sodium.crypto_secretbox_easy(
    sodium.from_string(newSecretValue),
    secretNonce,
    dek
  );

  // 3️⃣ Encrypt the DEK for each user
  const encrypted_keys = [];

  for (const user of currentMember) {
    const userPublicKeyBytes =
      user.public_key instanceof Uint8Array
        ? user.public_key
        : sodium.from_base64(user.public_key, sodium.base64_variants.ORIGINAL);

    // Generate ephemeral keypair for this encryption
    const ephemeralKeyPair = sodium.crypto_box_keypair();
    const keyNonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

    const encryptedDEK = sodium.crypto_box_easy(
      dek,
      keyNonce,
      userPublicKeyBytes,
      ephemeralKeyPair.privateKey
    );

    encrypted_keys.push({
      user_id: user.user_id,
      encrypted_key: sodium.to_base64(
        encryptedDEK,
        sodium.base64_variants.ORIGINAL
      ),
      nonce: sodium.to_base64(keyNonce, sodium.base64_variants.ORIGINAL),
      sender_public_key: sodium.to_base64(
        ephemeralKeyPair.publicKey,
        sodium.base64_variants.ORIGINAL
      ),
    });
  }

  // Clean up sensitive data
  dek.fill(0);

  return {
    encrypted_secret: sodium.to_base64(
      encryptedSecret,
      sodium.base64_variants.ORIGINAL
    ),
    nonce: sodium.to_base64(secretNonce, sodium.base64_variants.ORIGINAL),
    encrypted_keys,
  };
}
