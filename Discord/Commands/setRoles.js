const { Permissions } = require("discord.js");

module.exports = async function setRoles(
  /** import("discord.js").Message */ msg
) {
  if ((await msg.member.fetch()).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    if (!msg.mentions.members.first()) {
      await msg.reply(
        ":warning: La syntaxe de cette commande est `setRoles @membre @role1 @role2 @role3 ... Si aucun rôle n'est précisé, efface tous les rôles de l'utilisateur.`"
      );
    } else {
      msg.mentions.members
        .first()
        .roles.set(msg.mentions.roles)
        .catch(console.error);
      msg.react('✅').catch(console.error);
    }
  } else {
    msg
      .reply(
        ":octagonal_sign: Vous devez être administrateur pour effectuer cette commande."
      )
      .catch(console.error);
  }
};
