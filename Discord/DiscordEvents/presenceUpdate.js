module.exports = async function (
  /** 'module:"discord.js".Presence */ oldPresence,
  /** 'module:"discord.js".Presence */ newPresence,
  watchedMembers
) {
  if(watchedMembers.includes(newPresence.user.tag)) {
    if(!oldPresence || newPresence.status !== oldPresence.status) {
      let toSend = ":rotating_light: L'utilisateur "+newPresence.user.tag+", qui est sous surveillance, est désormais à l'état "+newPresence.status+" :rotating_light:.";
      console.log(toSend);
      newPresence.guild.channels.resolve(process.env.CHANNEL_ADMIN_ID).send(toSend).catch(console.error);
    }
  }
};
