import { readFileSync, writeFileSync } from "fs";
import { randomBytes } from "crypto";

const envFile = readFileSync(".env", "utf8");

const updatedEnvFile = envFile.replace(
  /TOKEN_SECRET=(.*)/,
  (match, currentToken) => {
    const newToken = randomBytes(32).toString("hex");
    return `TOKEN_SECRET=${newToken}`;
  }
);

writeFileSync(".env", updatedEnvFile);

console.log("Token Secret successfully generated.");
