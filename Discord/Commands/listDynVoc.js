module.exports = async function (
  /** module:"discord.js".Message */ msg,
  tableauChannelTexteAChannelVocal
) {
  msg.channel
    .send(":clock1: Début du listing des channels")
    .catch(console.error);
  let compteur = 0;
  for (const key of Object.keys(tableauChannelTexteAChannelVocal)) {
    msg.channel
      .send(
        "Pour le canal texte <#" +
          (await msg.guild.channels.resolve(key.toString())).id +
          "> dans la catégorie " +
          (
            await msg.guild.channels.resolve(
              (await msg.guild.channels.resolve(key.toString())).parentID
            )
          ).name
      )
      .catch(console.error);
    compteur = compteur + 1;
  }
  msg.channel
    .send(
      " :white_check_mark: Il y a " +
        compteur +
        " channels vocaux lancés par les étudiants."
    )
    .catch(console.error);
  msg.channel
    .send(
      "Il y a " +
        (await msg.guild.channels.resolve(process.env.CATEGORY_AMPHI)).children
          .length /
          2 +
        " amphis en cours."
    )
    .catch(console.error);
};
