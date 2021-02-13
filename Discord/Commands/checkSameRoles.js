
module.exports = async function (
  /** module:"discord.js".Message */ msg
) {
  let roles = (await msg.guild.roles.fetch()).cache;
  let rolesSignales = [];
  for (let roleEnCours of roles) {
    let found = roles.find(
      (role) =>
        roleEnCours[1].name.toUpperCase() === role.name.toUpperCase() && roleEnCours[1].id !== role.id && !rolesSignales.includes(roleEnCours[1].name)
    );
    if (found) {
      await msg.channel.send("Le role " + roleEnCours[1].name + " existe en plusieurs fois").catch(console.error);
      await rolesSignales.push(roleEnCours[1].name);
    }
  }

    msg.channel
      .send(":white_check_mark: La commande est terminée")
      .catch(console.error);
};
