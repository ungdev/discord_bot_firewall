module.exports = async function removeAllFromRole(/** module:"discord.js".Message */ msg) {
  /** Retirer un rôle à tous les membres ayant ce rôle (le rôle existe toujours, mais plus personne ne l'a). */
  if (!msg.mentions.roles.first()) {
    msg
      .reply(
        " :warning: Erreur. La syntaxe est `" +
          process.env.BOT_PREFIX +
          " removeAllFromRole @role`. Le rôle doit exister !"
      )
      .catch(console.error);
  } else {
    msg.mentions.roles
      .first()
      .members.forEach((member) =>
        member.roles.remove(msg.mentions.roles.first()).catch(console.error)
      );
    msg.channel
      .send(":white_check_mark: Plus personne n'a le rôle correspondant.")
      .catch(console.error);
  }
};
