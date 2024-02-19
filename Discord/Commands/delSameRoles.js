module.exports = async function delSameRoles(
  /** import("discord.js").Message */ msg
) {
  const roles = await msg.guild.roles.fetch();
  let deletedRoles = [];
  roles.forEach(async (roleEnCours) => {
    const rolesActualises = await await msg.guild.roles.fetch();
    const found = rolesActualises.find(
      (role) =>
        roleEnCours.name.toUpperCase() === role.name.toUpperCase() &&
        roleEnCours.id !== role.id &&
        !deletedRoles.includes(roleEnCours.name)
    );
    if (found) {
      await msg.channel
        .send(
          `Le role ${roleEnCours.name} existe en plusieurs fois et va être effacé.`
        )
        .catch(console.error);
      deletedRoles.push(roleEnCours.name);
      await roleEnCours.delete("En double").catch(console.error);
    }
  });

  msg.react("✅").catch(console.error);
};
