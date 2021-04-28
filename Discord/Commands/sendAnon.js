
let logFile = require("../../logFile");

module.exports = async function sendAnon(
  /** module:"discord.js".Message */ msg,
  parametres,
  currentUserAnonymousChannels,
  guildMember
) {
  if(parametres.length <= 3) {
    msg.reply("La commande est sous la forme "+process.env.BOT_PREFIX+" sendAnon channel message");
  }
  else if(!Object.keys(currentUserAnonymousChannels).includes(parametres[2])) {
    msg.reply("Il n'y a pas de channels anonymes disponibles").catch(console.error);
  }
  else {
    msg.client.guilds.resolve(process.env.SERVER_ID).channels.resolve(currentUserAnonymousChannels[parametres[2]]).send("[ANONYME]\n"+parametres.slice(3, parametres.length).join(" ")).then(
      (msgAnon) => {
        logFile.logToFile("Le message "+msgAnon.id+" a été envoyé par "+msg.author.tag+" alias "+guildMember.displayName);
        msg.reply("Message envoyé !");
      }
    )
  }
};
