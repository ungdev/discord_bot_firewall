const fs = require("fs");

const file = fs.createWriteStream(process.env.LOG_FILE, { flags: "a" });

module.exports.logToFile = function logToFile(chaine) {
  file.write(`${new Date().toISOString()} ${chaine}\n`);
};
