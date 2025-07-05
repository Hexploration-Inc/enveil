import { scrypt, createCipheriv, createDecipheriv } from "crypto";
import { promisify } from "util";

const algorithm = "aes-256-ctr";

// A hardcoded secret key for now. In a real app, this MUST come from a secure
// environment variable and should be a 32-byte string.
const secretKey = "0123456789abcdef0123456789abcdef";

if (Buffer.from(secretKey).length !== 32) {
  throw new Error("Secret key must be 32 bytes long for aes-256.");
}

export async function encrypt(text: string) {
  // Generate a key from the secret using scrypt for added security
  const key = (await promisify(scrypt)(secretKey, "salt", 32)) as Buffer;
  const iv = Buffer.from(require("crypto").randomBytes(16));

  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
}

export async function decrypt(hash: { iv: string; content: string }) {
  const key = (await promisify(scrypt)(secretKey, "salt", 32)) as Buffer;
  const iv = Buffer.from(hash.iv, "hex");
  const encryptedText = Buffer.from(hash.content, "hex");

  const decipher = createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString();
}
