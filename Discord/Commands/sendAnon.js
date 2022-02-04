const logFile = require("../../logFile");

module.exports = async function sendAnon(
  /** import("discord.js").Message */ msg,
  parametres,
  currentUserAnonymousChannels,
  guildMember
) {
  if (parametres.length <= 3) {
    await msg.reply(
      `La commande est sous la forme ${process.env.BOT_PREFIX} sendAnon channel message`
    );
  } else if (
    !Object.keys(currentUserAnonymousChannels).includes(parametres[2])
  ) {
    msg
      .reply("Il n'y a pas de channels anonymes disponibles")
      .catch(console.error);
  } else {
    msg.client.guilds
      .resolve(process.env.SERVER_ID)
      .channels.resolve(currentUserAnonymousChannels[parametres[2]])
      .send(`[ANONYME] ${parametres.slice(3, parametres.length).join(" ")}`)
      .then((msgAnon) => {
        logFile.logToFile(
          `Le message ${msgAnon.id} a été envoyé par ${msg.author.tag} alias ${guildMember.displayName} sur le canal ${parametres[2]}.`
        );
        msg.react('✅').catch(console.error);
      });
  }
};
