module.exports.removeNonASCII = function removeNonASCII(str) {
  let realString = "";
  if (str === null || str === "") return false;

  realString = str.toString();

  return realString.replace(/[^\x20-\x7E]/g, "");
};

/** Merci StackOverflow */
module.exports.getKeyByValue = function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
};

module.exports.roleValide = async function roleValide(/** string */ roleName) {
  if (roleName === "") return false;
  if (roleName === "CV ING") return false;
  if (
    roleName === "CVF2" ||
    roleName.startsWith("FB") ||
    roleName.startsWith("FA") ||
    roleName.startsWith("FC") ||
    roleName.startsWith("EX") ||
    roleName.startsWith("DD")
  )
    return false;
  if (roleName === "FOS4") return false;
  if (roleName === "EPSEM") return false;
  if (
    roleName.startsWith("NPML") ||
    roleName.startsWith("LV2B1") ||
    roleName.startsWith("LINGUA") ||
    roleName.startsWith("LX") ||
    roleName.startsWith("UX") ||
    roleName.startsWith("ATDOC") ||
    roleName.startsWith("APPTC") ||
    roleName.startsWith("SST") ||
    roleName.startsWith("ST") ||
    roleName.startsWith("MDPI")
  )
    return false;
  if (
    roleName.startsWith("TX") ||
    roleName.startsWith("AC") ||
    roleName.startsWith("ER")
  )
    return false;
  if (
    roleName.startsWith("PMCS") ||
    roleName.startsWith("PMXX") ||
    roleName.startsWith("PMTM") ||
    roleName.startsWith("PMHT") ||
    roleName.startsWith("PMEE") ||
    roleName.startsWith("PMEC") ||
    roleName.startsWith("PMME")
  ) {
    return false;
  }

  return true;
};

module.exports.renameRole = async function renameRole(/** string */ roleName) {
  if (roleName.endsWith("A")) return roleName.substr(0, roleName.length - 1);

  if (roleName.startsWith("LS")) return "LS";
  if (roleName.startsWith("LE")) return "LE";
  if (roleName.startsWith("IT")) return "IT";
  if (roleName.startsWith("LG")) return "LG";
  if (roleName.startsWith("LC")) return "LC";
  if (roleName.startsWith("KO")) return "KO";

  if (roleName.startsWith("ISI_C")) return "ISI_C";

  if (
    roleName.startsWith("PEXX") ||
    roleName.startsWith("PEEE") ||
    roleName.startsWith("PEEC") ||
    roleName.startsWith("PETM") ||
    roleName.startsWith("PEME") ||
    roleName.startsWith("PEHT") ||
    roleName.startsWith("PECS")
  ) {
    return "PE"
  }

  //if (roleName === "GE21R") return "GE21";

  return roleName;
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
