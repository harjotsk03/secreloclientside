import * as sodium from "libsodium-wrappers-sumo";

self.onmessage = async (e) => {
  const {
    encrypted_private_key,
    private_key_salt,
    private_key_nonce,
    kdf_ops,
    kdf_mem,
    password,
  } = e.data;

  try {
    await sodium.ready;

    const encryptedPriv = sodium.from_base64(
      encrypted_private_key,
      sodium.base64_variants.ORIGINAL
    );
    const salt = sodium.from_base64(
      private_key_salt,
      sodium.base64_variants.ORIGINAL
    );
    const nonce = sodium.from_base64(
      private_key_nonce,
      sodium.base64_variants.ORIGINAL
    );
    const passwordBytes = sodium.from_string(password);

    // This heavy computation runs in worker thread
    const symKey = sodium.crypto_pwhash(
      sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES,
      passwordBytes,
      salt,
      kdf_ops,
      kdf_mem,
      sodium.crypto_pwhash_ALG_ARGON2ID13
    );

    const privateKey = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      null,
      encryptedPriv,
      null,
      nonce,
      symKey
    );

    // Send back as base64 to transfer easily
    self.postMessage({
      success: true,
      privateKey: sodium.to_base64(privateKey, sodium.base64_variants.ORIGINAL),
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message,
    });
  }
};
