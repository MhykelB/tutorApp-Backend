const bcrypt = require("bcrypt");

async function hashPassword(input) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(input, salt);
  return hash;
}

module.exports = hashPassword;
