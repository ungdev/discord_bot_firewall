module.exports = async function checkSameRoles(
  /** import("discord.js").Message */ msg
) {
  const roles = (await msg.guild.roles.fetch());
  const rolesSignales = [];
  roles.forEach((roleEnCours) => {
    const found = roles.find(
      (role) =>
        roleEnCours.name.toUpperCase() === role.name.toUpperCase() &&
        roleEnCours.id !== role.id &&
        !rolesSignales.includes(roleEnCours.name)
    );
    if (found) {
      msg.channel
        .send(`Le role ${roleEnCours.name} existe en plusieurs fois`)
        .catch(console.error);
      rolesSignales.push(roleEnCours.name);
    }
  });

  await Promise.all(rolesSignales);

  msg.react('✅').catch(console.error);
};
