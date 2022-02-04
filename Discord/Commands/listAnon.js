module.exports = async function listAnon(
  /** import("discord.js").Message */ msg,
  currentUserAnonymousChannels
) {
  if (Object.keys(currentUserAnonymousChannels).length === 0) {
    msg
      .reply("Il n'y a pas de channels anonymes disponibles")
      .catch(console.error);
  } else {
    await msg.reply(
      `Les channels disponibles sont : ${Object.keys(
        currentUserAnonymousChannels
      ).join(", ")}`
    );
  }
  msg.channel
    .send(
      "N'oubliez pas que les administrateurs ont des logs permettant de lever votre anonymat !"
    )
    .catch(console.error);
};
