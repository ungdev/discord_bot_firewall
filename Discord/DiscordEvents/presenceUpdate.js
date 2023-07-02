const { getUsername } = require("../discordUtils");

module.exports = async function presenceUpdate(
  /** 'import("discord.js").Presence */ oldPresence,
  /** 'import("discord.js").Presence */ newPresence,
  watchedMembers
) {
  if (watchedMembers.includes(getUsername(newPresence))) {
    if (!oldPresence || newPresence.status !== oldPresence.status) {
      const toSend = `:rotating_light: L'utilisateur ${getUsername(newPresence)}, qui est sous surveillance, est désormais à l'état ${newPresence.status} :rotating_light:.`;
      console.log(toSend);
      newPresence.guild.channels
        .resolve(process.env.CHANNEL_ADMIN_ID)
        .send(toSend)
        .catch(console.error);
    }
  }
};
