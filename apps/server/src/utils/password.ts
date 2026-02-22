import crypto from "crypto";

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = "sha512";

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST)
    .toString("hex");

  return `pbkdf2$${ITERATIONS}$${salt}$${hash}`;
};

export const verifyPassword = (password: string, storedHash: string) => {
  const [algorithm, iterationsRaw, salt, hash] = storedHash.split("$");
  if (algorithm !== "pbkdf2" || !iterationsRaw || !salt || !hash) {
    return false;
  }

  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return false;
  }

  const candidateHash = crypto
    .pbkdf2Sync(password, salt, iterations, KEY_LEN, DIGEST)
    .toString("hex");

  const actualBuffer = Buffer.from(hash, "hex");
  const candidateBuffer = Buffer.from(candidateHash, "hex");

  if (actualBuffer.length !== candidateBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, candidateBuffer);
};
