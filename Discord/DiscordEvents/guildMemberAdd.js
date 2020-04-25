module.exports = async function (
  /** 'module:"discord.js".GuildMember */ member
) {
  member
    .send(
      "Bienvenue sur le serveur Discord des étudiants de l'UTT." +
        "\nCeci n'étant pas une zone de non droit, vous **devez** vous identifier en cliquant ici (**que vous soyez étudiant ou prof**) : " +
        process.env.BOT_URL +
        "\nVous devez également lire les règles dans le channel `accueil`" +
        "\n\nEn cas de problème, contactez l'un des administrateurs, visibles en haut à droite.+\nTapez `/UE` dans un channel texte pour voir la liste des commandes."
    )
    .catch(console.error);
};
