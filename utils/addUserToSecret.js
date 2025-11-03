import * as sodium from "libsodium-wrappers-sumo";

/**
 * Add a new user to an existing encrypted secret.
 *
 * @param {Object} secretRecord - The existing secret object
 * @param {string | Uint8Array} newUserPublicKey - The public key of the new user
 * @param {string | Uint8Array} currentUserPrivateKey - The private key of the currently logged-in user
 * @returns {Promise<{ user_id: string, encrypted_key: string, nonce: string, sender_public_key: string }>}
 */
export async function addUserToSecret(
  secretRecord,
  newUserPublicKey,
  currentUserPrivateKey,
) {
  await sodium.ready;

  // Convert keys from base64 if necessary
  const userPrivateKeyBytes =
    typeof currentUserPrivateKey === "string"
      ? sodium.from_base64(
          currentUserPrivateKey,
          sodium.base64_variants.ORIGINAL
        )
      : currentUserPrivateKey;

  const senderPublicKeyBytes = sodium.from_base64(
    secretRecord.sender_public_key,
    sodium.base64_variants.ORIGINAL
  );

  const encryptedSecretKeyBytes = sodium.from_base64(
    secretRecord.encrypted_secret_key,
    sodium.base64_variants.ORIGINAL
  );

  const userNonceBytes = sodium.from_base64(
    secretRecord.user_nonce,
    sodium.base64_variants.ORIGINAL
  );

  // 1️⃣ Decrypt the existing DEK using the current user's private key
  const dek = sodium.crypto_box_open_easy(
    encryptedSecretKeyBytes,
    userNonceBytes,
    senderPublicKeyBytes,
    userPrivateKeyBytes
  );

  // 2️⃣ Encrypt the DEK for the new user
  const newUserPublicKeyBytes =
    newUserPublicKey instanceof Uint8Array
      ? newUserPublicKey
      : sodium.from_base64(newUserPublicKey, sodium.base64_variants.ORIGINAL);

  const ephemeralKeyPair = sodium.crypto_box_keypair();
  const keyNonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const encryptedKeyForNewUser = sodium.crypto_box_easy(
    dek,
    keyNonce,
    newUserPublicKeyBytes,
    ephemeralKeyPair.privateKey
  );

  // 3️⃣ Return the object to store for the new user
  return {
    encrypted_key: sodium.to_base64(
      encryptedKeyForNewUser,
      sodium.base64_variants.ORIGINAL
    ),
    nonce: sodium.to_base64(keyNonce, sodium.base64_variants.ORIGINAL),
    sender_public_key: sodium.to_base64(
      ephemeralKeyPair.publicKey,
      sodium.base64_variants.ORIGINAL
    ),
  };
}
