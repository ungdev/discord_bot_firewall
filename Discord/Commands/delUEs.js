const utils = require("../discordUtils");

module.exports = async function delUEs(
  /** import("discord.js").Message */ msg,
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
        ` :warning: Erreur. La syntaxe est \`${process.env.BOT_PREFIX} delUEs <categoryID> vocal | tout\`.`
      )
      .catch(console.error);
  } else {
    //iterate on each channels of the guild
    for (const channel of msg.guild.channels.cache) {
      if (channel[1].parent && channel[1].parent.id === parametres[2])
        await utils.delUE(channel[1], msg, parametres[3]);
    }
    msg.react("✅").catch(console.error);
  }
};
