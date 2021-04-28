
module.exports = async function checkSameRoles(
  /** module:"discord.js".Message */ msg
) {
  let roles = (await msg.guild.roles.fetch()).cache;
  let rolesSignales = [];
  roles.forEach(roleEnCours => {
    let found = roles.find(
      (role) =>
        roleEnCours.name.toUpperCase() === role.name.toUpperCase() && roleEnCours.id !== role.id && !rolesSignales.includes(roleEnCours.name)
    );
    if (found) {
      msg.channel.send("Le role " + roleEnCours.name + " existe en plusieurs fois").catch(console.error);
      rolesSignales.push(roleEnCours.name);
    }
  });

  await Promise.all(rolesSignales);

    msg.channel
      .send(":white_check_mark: La commande est terminée")
      .catch(console.error);
};
