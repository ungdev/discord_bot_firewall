module.exports = async function listDynVoc(
  /** import("discord.js").Message */ msg,
  tableauChannelTexteAChannelVocal
) {
  msg.channel
    .send(":clock1: Début du listing des channels")
    .catch(console.error);
  let compteur = 0;
  Object.keys(tableauChannelTexteAChannelVocal).forEach(async (key) => {
    msg.channel
      .send(
        `Pour le canal texte <#${
          (await msg.guild.channels.resolve(key.toString())).id
        }> dans la catégorie ${
          (
            await msg.guild.channels.resolve(
              (
                await msg.guild.channels.resolve(key.toString())
              ).parentId
            )
          ).name
        }`
      )
      .catch(console.error);
    compteur += 1;
  });
  msg.channel
    .send(
      ` :white_check_mark: Il y a ${compteur} channels vocaux lancés par les étudiants.`
    )
    .catch(console.error);
  msg.channel
    .send(
      `Il y a ${
        msg.guild.channels.resolve(process.env.CATEGORY_AMPHI).children.size / 2
      } amphis en cours.`
    )
    .catch(console.error);
};
