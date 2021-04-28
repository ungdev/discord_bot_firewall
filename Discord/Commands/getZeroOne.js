module.exports = async function getZeroOne(/** module:"discord.js".Message */ msg) {
  msg.channel
    .send(
      ":clock1: Cette commande peut être longue, elle affichera un message pour signaler sa fin. Si elle ne le fait pas, contacter un administrateur."
    )
    .then(async function () {
      let compteur = 0;
      (await msg.guild.roles.fetch()).cache.forEach((role) => {
        if (role.members.size === 0 || role.members.size === 1) {
          msg.channel
            .send(
              "Le rôle " +
                role.name +
                " a " +
                role.members.size +
                " utilisateur."
            )
            .catch(console.error);
          compteur = compteur + 1;
        }
      });
      msg.channel
        .send(
          ":white_check_mark: Commande terminée, " +
            compteur +
            " roles ont été identifiés."
        )
        .catch(console.error);
    })
    .catch(console.error);
};
