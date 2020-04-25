module.exports = async function (
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  /** Suppression d'une UE en indiquant son channel texte */
  if (
    parametres.length !== 4 ||
    !msg.mentions.channels.first() ||
    !["tout".toLowerCase(), "vocal".toLowerCase()].includes(
      parametres[3].toLowerCase()
    )
  ) {
    msg
      .reply(
        " :warning: Erreur. La syntaxe est `" +
          process.env.BOT_PREFIX +
          " delUE #ueASupprimer vocal | tout`. Vous devez tagguer le channel texte de l'UE !"
      )
      .catch(console.error);
  } else {
    if (
      parametres[3].toLowerCase() === "tout" ||
      parametres[3].toLowerCase() === "vocal"
    )
      msg.guild.channels.cache
        .find(
          (channel) =>
            (channel.name
              .toLowerCase()
              .includes(
                " " + msg.mentions.channels.first().name.toLowerCase()
              ) ||
              channel.name
                .toLowerCase()
                .includes(
                  msg.mentions.channels.first().name.toLowerCase() + " "
                )) &&
            channel.type === "voice"
        )
        .delete("Demandé par " + msg.author.tag + " " + msg.author.username)
        .catch(console.error);
    if (parametres[3].toLowerCase() === "tout") {
      msg.mentions.channels
        .first()
        .delete("Demandé par " + msg.author.tag + " " + msg.author.username)
        .catch(console.error);
      (await msg.guild.roles.fetch()).cache
        .find(
          (role) =>
            role.name.toUpperCase() ===
            msg.mentions.channels.first().name.toUpperCase()
        )
        .delete("Demandé par " + msg.author.tag + " " + msg.author.username)
        .catch(console.error);
    }
    msg.channel
      .send(
        ":white_check_mark: Ce que vous avez demandé a été effacé pour " +
          msg.mentions.channels.first().name +
          " !"
      )
      .catch(console.error);
  }
};
