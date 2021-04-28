let discordUtils = require("../discordUtils");

module.exports = async function assignLireEcrireBasique(
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  if (!msg.mentions.roles.first()) {
    msg.reply(
      " :warning: Le rôle n'a pas été spécifie. La commande est `assignLireEcrireBasique categoryID @role oui|non|null`"
    );
  } else if (!parametres[2] || !msg.guild.channels.cache.get(parametres[2])) {
    msg.reply(
      " :warning: Le channel ou la catégorie n'a pas été trouvée. La commande est `assignLireEcrireBasique channelID|categoryID @role oui|non|null`"
    );
  } else if (
    !parametres[4] ||
    !["oui", "non", "null"].includes(parametres[4])
  ) {
    msg.reply(
      " :warning: Vous devez spécifier oui, non ou null. La commande est `assignLireEcrireBasique categoryID @role oui|non|null`"
    );
  } else {
    msg.channel
      .send(
        " :clock1: Cette commande peut durer certain temps. Vous serez averti de sa fin. Si ce n'est pas le cas, alertez un administrateur."
      )
      .catch(console.error);
    let channel = msg.guild.channels.resolve(parametres[2]);
    if (channel.type === "category")
      channel.children.forEach((chan) =>
        discordUtils.assignPerm(
          chan,
          msg.mentions.roles.first(),
          parametres[4]
        )
      );
    else
      discordUtils.assignPerm(
        channel,
        msg.mentions.roles.first(),
        parametres[4]
      );
    msg.channel
      .send(" :white_check_mark: La commande est terminée !")
      .catch(console.error);
  }
};
