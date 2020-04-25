module.exports = async function (
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  if (parametres.length !== 3 || !msg.mentions.roles.first()) {
    msg
      .reply(
        " :warning:  Erreur. La syntaxe est `" +
          process.env.BOT_PREFIX +
          " getNb @RoleUE`. Le rôle doit exister."
      )
      .catch(console.error);
  } else {
    msg.channel
      .send(
        ":white_check_mark: Il y a " +
          msg.mentions.roles.first().members.size +
          " utilisateur(s) dans le rôle " +
          msg.mentions.roles.first().name
      )
      .catch(console.error);
  }
};
