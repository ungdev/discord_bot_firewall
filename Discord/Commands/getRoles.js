module.exports = async function getRoles(
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  if (parametres.length !== 3) {
    msg
      .reply(
        " :warning:  Erreur. La syntaxe est `" +
          process.env.BOT_PREFIX +
          " getRoles NombreDePersonnes`."
      )
      .catch(console.error);
  } else {
    msg.channel
      .send(
        ":clock1: Cette commande peut être longue, elle affichera un message pour signaler sa fin. Si elle ne le fait pas, contacter un administrateur."
      )
      .then(async function () {
        let compteur = 0;
        (await msg.guild.roles.fetch()).cache.forEach((role) => {
          if (role.members.size.toString() === parametres[2].toString()) {
            msg.channel
              .send(
                "Le rôle " +
                  role.name +
                  " a " +
                  role.members.size +
                  " utilisateur(s)."
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
  }
};
