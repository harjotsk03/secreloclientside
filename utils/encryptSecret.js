import * as sodium from "libsodium-wrappers-sumo";

/**
 * Encrypt a secret secret using a recipient's public key.
 * Generates an ephemeral keypair for sender authenticity.
 *
 * @param {string|Uint8Array} secret - The plaintext to encrypt.
 * @param {string|Uint8Array} recipientPublicKey - Recipient's public key (base64 or Uint8Array).
 * @returns {Promise<{ ciphertext: string, nonce: string, sender_public_key: string }>}
 */
export async function encryptSecret(secret, recipientPublicKey) {
  await sodium.ready;

  // Normalize inputs
  const msgBytes = sodium.from_string(secret);
  const pubKeyBytes =
    recipientPublicKey instanceof Uint8Array
      ? recipientPublicKey
      : sodium.from_base64(recipientPublicKey, sodium.base64_variants.ORIGINAL);

  // Generate an ephemeral sender keypair
  const ephemeralKeyPair = sodium.crypto_box_keypair();

  // Create a nonce (must be unique per secret)
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  // Encrypt using crypto_box (public-key authenticated encryption)
  const ciphertext = sodium.crypto_box_easy(
    msgBytes,
    nonce,
    pubKeyBytes,
    ephemeralKeyPair.privateKey
  );

  return {
    ciphertext: sodium.to_base64(ciphertext, sodium.base64_variants.ORIGINAL),
    nonce: sodium.to_base64(nonce, sodium.base64_variants.ORIGINAL),
    sender_public_key: sodium.to_base64(
      ephemeralKeyPair.publicKey,
      sodium.base64_variants.ORIGINAL
    ),
  };
}
