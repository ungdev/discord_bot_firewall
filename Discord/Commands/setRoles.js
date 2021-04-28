module.exports = async function setRoles(/** module:"discord.js".Message */ msg) {
  if ((await msg.member.fetch()).hasPermission("ADMINISTRATOR")) {
    if (!msg.mentions.members.first()) {
      msg.reply(
        ":warning: La syntaxe de cette commande est `setRoles @membre @role1 @role2 @role3 ... Si aucun rôle n'est précisé, efface tous les rôles de l'utilisateur.`"
      );
    } else {
      msg.mentions.members
        .first()
        .roles.set(msg.mentions.roles)
        .catch(console.error);
      msg.channel
        .send(":white_check_mark: L'opération a été réalisée avec succès.")
        .catch(console.error);
    }
  } else {
    msg
      .reply(
        ":octagonal_sign: Vous devez être administrateur pour effectuer cette commande."
      )
      .catch(console.error);
  }
};
