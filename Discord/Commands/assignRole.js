module.exports = async function assignRole(
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  if ((await msg.member.fetch()).hasPermission("ADMINISTRATOR")) {
    if (
      !msg.mentions.members.first() ||
      !msg.mentions.roles.first() ||
      !parametres[4] ||
      !["ajouter", "supprimer"].includes(parametres[4])
    ) {
      msg.reply(
        ":warning: La syntaxe de cette commande est `assignRole @membre @role ajouter|supprimer`"
      );
    } else {
      if (parametres[4].toLowerCase() === "ajouter")
        msg.mentions.members
          .first()
          .roles.add(msg.mentions.roles.first())
          .catch(console.error);
      else
        msg.mentions.members
          .first()
          .roles.remove(msg.mentions.roles.first())
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
