let utils = require("../discordUtils");

module.exports = async function (
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  /** Suppression d'une UE en indiquant son channel texte */
  if (
    parametres.length !== 4 ||
    !msg.mentions.channels.first() ||
    !["tout".toLowerCase(), "vocal".toLowerCase()].includes(
      parametres[3].toLowerCase()
    )
  ) {
    msg
      .reply(
        " :warning: Erreur. La syntaxe est `" +
          process.env.BOT_PREFIX +
          " delUE #ueASupprimer vocal | tout`. Vous devez tagguer le channel texte de l'UE !"
      )
      .catch(console.error);
  } else {
    await utils.delUE(msg.mentions.channels.first(), msg, parametres[3]);
  }
};
