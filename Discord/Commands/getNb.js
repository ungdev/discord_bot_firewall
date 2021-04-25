module.exports = async function (
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  if (parametres.length !== 3 || (!msg.mentions.roles.first() && !msg.guild.roles.resolve(parametres[2]))) {
    msg
      .reply(
        " :warning:  Erreur. La syntaxe est `" +
          process.env.BOT_PREFIX +
          " getNb @Role|role_id`. Le rôle doit exister."
      )
      .catch(console.error);
  } else {
    let role;
    if(msg.mentions.roles.first()) {
      role = msg.mentions.roles.first();
    } else
    {
      role = msg.guild.roles.resolve(parametres[2]);
    }
    msg.channel
      .send(
        ":white_check_mark: Il y a " +
          role.members.size +
          " utilisateur(s) dans le rôle " +
          role.name
      )
      .catch(console.error);
  }
};
