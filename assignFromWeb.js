// noinspection ES6MissingAwait

const capitalize = require("capitalize");
const discordUtils = require("./Discord/discordUtils");
const utils = require("./utils");

module.exports.etuToDiscord = async function etuToDiscord(
  membreSiteEtu,
  /** string */ discordUsername,
  /** 'import("discord.js").Guild */ guild,
  nameOverride,
  additionalRoles
) {
  /** On récupère son compte discord dans le serveur */
  const membreDiscord = await discordUtils.getUserFromGuild(
    discordUsername,
    guild
  );
  /** Si on l'a trouvé */
  if (membreDiscord) {
    const roles = (await guild.roles.fetch());
    /** Liste des id de rôles à attribuer */
    /** On définit son pseudo */
    let pseudo = "";
    console.log(`Traitement de ${discordUsername} - ${membreSiteEtu.firstName} ${membreSiteEtu.lastName}`)
    if (Object.keys(nameOverride).includes(discordUsername)) {
      pseudo = nameOverride[discordUsername];
    } else {
      pseudo = `${capitalize.words(
        membreSiteEtu /** string */.firstName
          .toString()
      )} ${membreSiteEtu /** string */.lastName
        .toString()
        .toUpperCase()}`;
    }
    if (/** bool */ membreSiteEtu.isStudent) {
      if (!membreSiteEtu.formation) {
        await membreDiscord.roles.add(process.env.ROLE_ANCIEN_ETUDIANT_ID);
        pseudo += " - Ancien étu";
      } else {
        /** On ajoute le rôle étudiant */
        await membreDiscord.roles.add(process.env.ROLE_ETUDIANT_ID);
        const tableauChainesToRoles = /** Array<String> */ membreSiteEtu.uvs;
        /** On définit un pseudo */
        let formations = [];
        for (let nombre in membreSiteEtu.branch_list) {
          tableauChainesToRoles.push(membreSiteEtu.branch_list[nombre]);
          formations.push(`${membreSiteEtu.branch_list[nombre]}${membreSiteEtu.level_list[nombre]}`);
        }
        pseudo += ` - ${formations.join("/")}`;
        /** On définit la liste des noms de rôles à attribuer (nom uvs + nom de branche) */
        const rolesDone = [];

        tableauChainesToRoles.forEach(async (chaine) => {
          chaine = chaine.toUpperCase();
          if (await utils.roleValide(chaine) && !rolesDone.includes(await utils.renameRole(chaine))) {
            chaine = await utils.renameRole(chaine.toUpperCase());
            let role = await roles.find(
              (roleToTest) =>
                roleToTest.name.toUpperCase() ===
                chaine.toUpperCase()
            );
            if (!role && Object.keys(additionalRoles).includes(chaine.toUpperCase())) role = additionalRoles[chaine.toUpperCase()];
            if (role) {
              await membreDiscord.roles.add(role).catch(console.error);
            } else {
              /** Si le rôle n'existe pas, on le crée et on alerte sur le chan texte dédié au bot. */
              await guild.channels
                .resolve(process.env.CHANNEL_ADMIN_ID)
                .send(
                  `Le rôle ${chaine} va être créé pour l'utilisateur ${discordUtils.getUsername(membreDiscord)} ${pseudo}`
                );
              await guild.roles
                .create(
                  { name: chaine.toUpperCase() },
                )
                .then(async (createdRole) => {
                  membreDiscord.roles.add(createdRole).catch(console.error);
                  await guild.roles.fetch(createdRole.id);
                  additionalRoles[chaine.toUpperCase()] = createdRole.id;
                })
                .catch(console.error);
              rolesDone.push(chaine.toUpperCase());
            }
          }
        });
      }
    } else await membreDiscord.roles.add(process.env.ROLE_ENSEIGNANT_ID);
    /** Si pas étudiant, le seul rôle est le rôle prof */
    /** On applique le pseudo sur le compte */
    if (pseudo.length > 32) {
      guild.channels
        .resolve(process.env.CHANNEL_ADMIN_ID)
        .send(
          ` :warning: Le pseudo ${pseudo} de l'utilisateur ${discordUtils.getUsername(membreDiscord)} est trop long. Vérifiez son pseudo.`
        );
      pseudo = pseudo.slice(0, 32);
    }
    await membreDiscord.setNickname(pseudo).catch(console.error);
    /** On affiche un message */
    return "Vos rôles ont été affectés. Si d'ici quelques heures rien ne change dans votre compte, merci de nous contacter.<br><br><b>Vous pouvez maintenant fermer cette fenêtre et retourner sur Discord.</b>";
  }
  return "Utilisateur discord non trouvé dans le serveur. Avez-vous bien rejoint le serveur Discord ? <a href='/'>Revenir au départ</a>";
};
