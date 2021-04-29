module.exports = async function delSameRoles(
  /** module:"discord.js".Message */ msg
) {
  const roles = (await msg.guild.roles.fetch()).cache;
  roles.forEach(async (roleEnCours) => {
    const rolesActualises = await (await msg.guild.roles.fetch()).cache;
    const found = rolesActualises.find(
      (role) =>
        roleEnCours[1].name.toUpperCase() === role.name.toUpperCase() &&
        roleEnCours[1].id !== role.id
    );
    if (found) {
      await msg.channel
        .send(
          `Le role ${roleEnCours[1].name} existe en plusieurs fois et va être effacé.`
        )
        .catch(console.error);
      await roleEnCours[1].delete("En double").catch(console.log);
    }
  });

  msg.channel
    .send(":white_check_mark: La commande est terminée")
    .catch(console.error);
};
