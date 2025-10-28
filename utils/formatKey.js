import * as sodium from "libsodium-wrappers-sumo";

/**
 * Converts a key (Uint8Array or base64 string) into a clean, readable format.
 *
 * @param {Uint8Array|string|null} key - The key to format.
 * @param {"base64"|"hex"|"short"} [format="base64"] - Output format.
 * @returns {string} - A readable string version of the key.
 */
export async function formatKey(key, format = "base64") {
  await sodium.ready;

  if (!key) return "[no key loaded]";

  // If it's already a base64 string, normalize it
  if (typeof key === "string" && /^[A-Za-z0-9+/=]+$/.test(key.trim())) {
    if (format === "short") return key.slice(0, 6) + "..." + key.slice(-6);
    return key;
  }

  // If Uint8Array, encode properly
  if (key instanceof Uint8Array) {
    switch (format) {
      case "hex":
        return Buffer.from(key).toString("hex");
      case "short":
        return (
          sodium.to_base64(key, sodium.base64_variants.ORIGINAL).slice(0, 6) +
          "..." +
          sodium.to_base64(key, sodium.base64_variants.ORIGINAL).slice(-6)
        );
      default:
        return sodium.to_base64(key, sodium.base64_variants.ORIGINAL);
    }
  }

  return "[invalid key type]";
}
