const { ActivityType } = require("discord.js");

module.exports = async function ready(
  /** 'import("discord.js").Client */ client
) {
  /** On dit qu'il est en train de jouer à "gérer le serveur" sur l'url du BOT */
  client.user
    .setActivity(process.env.BOT_PREFIX, {
      type: ActivityType.Listening,
      url: process.env.BOT_URL,
    });
  /** On alerte sur le chan dédié au bot du démarrage */
  (await client.channels.resolve(process.env.CHANNEL_ADMIN_ID)).send(
    "Je suis en ligne. Je viens d'être (re)démarré. Cela signifie qu'il y a soit eu un bug, soit que j'ai été mis à jour, soit qu'on m'a redémarré manuellement. La gestion des vocaux a été remise à zéro (je ne gère plus ceux déjà créés)."
  );
  return null;
};
