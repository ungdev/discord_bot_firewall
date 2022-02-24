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
    const unvalidRoles = ["", "CVF2", "FOS4", "EPSEM"];
    for (const role of unvalidRoles) {
        if (roleName === role) {
            return false;
        }
    }
    const partiallyUnvalidRoles = [
        "FB", "FA", "FC", "EX", "DD", "NPML", "LV2B1", "LINGUA", "EM", "UM",
        "LX", "UX", "ATDOC", "APPTC", "SST", "ST", "MDPI", "TX", "EX", "MIC",
        "AC", "ER", "PMCS", "PMXX", "PMTM", "PMHT", "PMEE", "PMEC", "PMME"
    ]
    for (const role of partiallyUnvalidRoles) {
        if (roleName.startsWith(role)) {
            return false;
        }
    }

    return true;
};

module.exports.sleep = async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports.renameRole = async function renameRole(/** string */ roleName) {
    if (roleName.endsWith("A")) return roleName.substr(0, roleName.length - 1);

    for (const starting of ["LS", "LE", "IT", "LG", "LC", "KO","LX"])
        if (roleName.startsWith(starting))
            return starting;

    if (roleName.startsWith("ISI_C")) return "ISI_C";

    if (roleName.startsWith("OCR")) return "OCR";

    const rolesPE = ["PEXX", "PEEE", "PEEC", "PETM", "PEME", "PEHT", "PECS"];
    for (const starting of rolesPE)
        if (roleName.startsWith(starting))
            return "PE";

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
