/**
 * Répond au message de la commande avec un message indiquant
 * comment accéder à son certificat de scolarité
 *
 * @param msg : import("discord.js").Message
 * @returns {Promise<void>}
 */
module.exports = async function certif(msg) {
  await msg.reply(
    "Comment trouver son certificat de scolarité : \n" +
      "1. Aller sur https://ent.utt.fr/ ;\n" +
      "2. Se connecter avec ses identifiants UTT ;\n" +
      '3. Suivre le chemin suivant : onglet "Formation" --> sous-onglet "Dossier des étudiants" ;\n' +
      '4. Aller dans le menu "Mes documents administratifs" ;\n' +
      "5. Récupérer le document souhaité."
  );
};
