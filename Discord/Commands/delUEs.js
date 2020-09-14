let utils = require('../discordUtils')

module.exports = async function(
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  /** Suppression d'une UE en indiquant son channel texte */
  if (
    parametres.length !== 4 ||
    !msg.guild.channels.cache.has(parametres[2]) ||
    !["tout".toLowerCase(), "vocal".toLowerCase()].includes(
      parametres[3].toLowerCase()
    )
  ) {
    msg
      .reply(
        " :warning: Erreur. La syntaxe est `" +
        process.env.BOT_PREFIX +
        " delUEs <categoryID> vocal | tout`."
      )
      .catch(console.error);
  } else {
    msg.guild.channels.cache.get(parametres[2]).children.forEach(channel => utils.delUE(channel, msg, parametres[3]))
  }
};
