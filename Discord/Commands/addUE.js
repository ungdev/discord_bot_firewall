let discordUtils = require("../discordUtils");

module.exports = async function (
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  /** S'il n'y a pas 3 paramètres dont la mention d'un role ni de ce qui doit être créé */
  if (
    parametres.length !== 5 ||
    !msg.mentions.roles.first() ||
    !["texte", "vocal", "lesdeux"].includes(parametres[4].toLowerCase())
  ) {
    msg
      .reply(
        " :warning:  Erreur. La syntaxe est `" +
          process.env.BOT_PREFIX +
          " addUE @RoleUE <categoryID> texte | vocal | lesDeux`. La catégorie et le rôle doivent déjà exister."
      )
      .catch(console.error);
  } else {
    /** Si tout va bien */
    /** On crée le texte avec aucune permission pour @everyone et les permissions d'écrire pour le rôle concerné */
    if (
      parametres[4].toLowerCase() === "texte" ||
      parametres[4].toLowerCase() === "lesdeux"
    ) {
      msg.guild.channels
        .create(msg.mentions.roles.first().name.toLowerCase(), {
          parent: parametres[3],
          permissionOverwrites: [
            {
              id: msg.guild.roles.everyone,
              deny: discordUtils.toutesPermissions,
            },
            {
              id: msg.mentions.roles.first().id,
              allow: discordUtils.permissionsLireEcrireBasiques,
            },
          ],
        })
        .then(function (channel) {
          channel.send(
            "Bonjour <@&" +
              msg.mentions.roles.first().id +
              ">, votre channel texte vient d'être créé !"
          );
        })
        .catch(console.error);
    }
    /** On crée le vocal avec aucune permission pour @everyone et les permissions de parler/connecter pour le rôle concerné */
    if (
      parametres[4].toLowerCase() === "vocal" ||
      parametres[4].toLowerCase() === "lesdeux"
    ) {
      msg.guild.channels
        .create(msg.mentions.roles.first().name.toLowerCase() + " - vocal", {
          parent: parametres[3],
          type: "voice",
          userLimit: 99,
          permissionOverwrites: [
            {
              id: msg.guild.roles.everyone,
              deny: discordUtils.toutesPermissions,
            },
            {
              id: msg.mentions.roles.first().id,
              allow: discordUtils.permissionsLireEcrireBasiques,
            },
          ],
        })
        .catch(console.error);
    }
    msg.channel
      .send(":white_check_mark: Si la catégorie existe, c'est fait !")
      .catch(console.error);
  }
};
