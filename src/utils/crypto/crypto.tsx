import crypto from "crypto";

// Need to redicuss with the BE dev
export function hashPassword(password: string, salt: string) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
      if (error) reject(error);

      resolve(hash.toString("hex").normalize());
    });
  });
}
