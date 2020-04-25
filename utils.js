module.exports.remove_non_ascii = function (str) {
  if (str === null || str === "") return false;
  else str = str.toString();

  return str.replace(/[^\x20-\x7E]/g, "");
};

/** Merci StackOverflow */
module.exports.getKeyByValue = function (object, value) {
  return Object.keys(object).find((key) => object[key] === value);
};

module.exports.author =
  "Le créateur de ce bot est Ivann LARUELLE, ivann.laruelle@gmail.com" +
  "\nJ'aime l'OpenSource : https://github.com/ungdev/discord_bot_firewall / https://hub.docker.com/repository/docker/ungdev/discord_bot_firewall" +
  "\n\n:sos: Si vous aussi vous voulez faire un bot sur Discord, ne faites pas la même erreur que moi, **oubliez NodeJS**. Quelle idée quand j'y repense ... Si j'avais su plutôt que la librairie discord.py existait..." +
  "\nL'auteur du design/graphisme de la page web de connexion est un autre contributeur anonyme." +
  "\n\n\nLe créateur du système d'export est ici : https://github.com/Tyrrrz";

module.exports.baseUrl = "https://etu.utt.fr";

module.exports.texteBug =
  "Nous n'avons pas pu vous authentifier. Cela peut être du à un bug momentané. <a href='/'>Revenir au départ et recommencer !</a>";
