const bcrypt = require("bcryptjs");

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$/;

function isPasswordHash(value) {
  return typeof value === "string" && BCRYPT_HASH_PATTERN.test(value);
}

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function verifyPassword(password, passwordHash) {
  if (!isPasswordHash(passwordHash)) return false;
  return bcrypt.compare(password, passwordHash);
}

module.exports = { hashPassword, isPasswordHash, verifyPassword };