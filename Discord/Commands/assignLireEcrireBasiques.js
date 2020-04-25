let discordUtils = require("../discordUtils");

module.exports = async function (
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  if (!msg.mentions.roles.first()) {
    msg.reply(
      " :warning: Le rôle n'a pas été spécifie. La commande est `assignLireEcrireBasique categoryID @role oui|non|null`"
    );
  }
  else if(!parametres[2] || !msg.guild.channels.cache.get(parametres[2])) {
    msg.reply(
      " :warning: La catégorie n'a pas été trouvée. La commande est `assignLireEcrireBasique categoryID @role oui|non|null`"
    );
  }
  else if(!parametres[4] || !["oui", "non","null"].includes(parametres[4])) {
    msg.reply(
      " :warning: Vous devez spécifier oui, non ou null. La commande est `assignLireEcrireBasique categoryID @role oui|non|null`"
    );
  } else {
    msg.channel.send(" :clock1: Cette commande peut durer certain temps. Vous serez averti de sa fin. Si ce n'est pas le cas, alertez un administrateur.").catch(console.error);
    msg.guild.channels.resolve(parametres[2]).children
        .forEach(function (channel) {
          switch (parametres[4]) {
            case "oui":
              channel.updateOverwrite(
                msg.mentions.roles.first(),
                discordUtils.permissionsLireEcrireBasiquesOverwrite(true)
            );
              break;
            case "non":
              channel.updateOverwrite(
                msg.mentions.roles.first(),
                discordUtils.permissionsLireEcrireBasiquesOverwrite(false)
            );
              break;
            case "null":
              channel.updateOverwrite(
                msg.mentions.roles.first(),
                discordUtils.permissionsLireEcrireBasiquesOverwrite(null)
              );
              break;
          }
        });
    msg.channel.send(" :white_check_mark: La commande est terminée !").catch(console.error);
  }
};
