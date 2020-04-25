module.exports = async function (/** module:"discord.js".Message */ msg) {
  msg.channel
    .send(
      "URL de connexion (à transmettre) : " +
        process.env.BOT_URL +
        "\n\nLe lien d'invitation direct (peu recommandé) : " +
        process.env.LIEN_INVITATION_DISCORD
    )
    .catch(console.error);
};
