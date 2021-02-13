let discordUtils = require("../discordUtils");

module.exports = async function (
  /** module:"discord.js".Message */ msg
) {
  let roles = (await msg.guild.roles.fetch()).cache;
  await roles.forEach( async (roleEnCours) => {
    let found = roles.find(
      (role) =>
        roleEnCours.name.toUpperCase() === role.name.toUpperCase() && roleEnCours.id !== role.id
    );
    if (found) {
      await msg.channel.send("Le role " + roleEnCours.name + " existe en plusieurs fois").catch(console.error);
    }
  });

    msg.channel
      .send(":white_check_mark: La commande est terminée")
      .catch(console.error);
};
