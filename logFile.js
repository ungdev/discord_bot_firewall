const fs = require('fs');
let file = fs.createWriteStream(process.env.LOG_FILE, {flags:'a'});

module.exports.logToFile = function(chaine) {
    file.write((new Date()).toISOString()+" "+chaine+"\n");
}