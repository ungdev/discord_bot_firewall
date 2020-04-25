let Discord = require("discord.js");

module.exports.help = async function (/** module:"discord.js".Message */ msg) {
  msg
    .reply(
      ":tools: Plusieurs fonctions accessibles. Contacter Ivann LARUELLE, ivann.laruelle@gmail.com, créateur de ce bot, en cas de problème"
    )
    .catch(console.error);
  if (msg.channel.id === process.env.CHANNEL_ADMIN_ID) {
    msg.channel
      .send(
        "\n\n`" +
          process.env.BOT_PREFIX +
          " addUE @RoleUE <categoryID> texte | vocal | lesDeux`. Permet de créer les channels texte et voix d'un rôle existant avec les permissions correctes. La catégorie et le rôle doivent déjà exister." +
          "\n`" +
          process.env.BOT_PREFIX +
          " delUE #ueASupprimer vocal | tout`. Supprime les channels texte et voix de l'UE et le rôle. Vous devez tagguer le channel texte de l'UE !" +
          "\n`" +
          process.env.BOT_PREFIX +
          " getNb @ROLE`. Récupère le nombre de personnes dans le rôle. Le rôle doit exister." +
          "\n`" +
          process.env.BOT_PREFIX +
          " getRoles NombrePersonne`. Affiche la liste des rôles ne contenant que le nombre de personnes demandé. :clock1: Cette commande peut être longue." +
          "\n`" +
          process.env.BOT_PREFIX +
          " getZeroOne`. Affiche les rôles ayant soit 0 ou 1 personne dedans. :clock1: Cette commande peut être longue." +
          "\n`" +
          process.env.BOT_PREFIX +
          " getUrl`. Affiche les url du serveur web du bot, le lien d'invitation discord" +
          "\n`" +
          process.env.BOT_PREFIX +
          " listDynVoc`. Affiche tous les channels textes dans lesquels des vocaux ont été lancés, ainsi que leur catégorie. Utile pour savoir quand lancer une mise à jour du bot." +
          "\n`" +
        process.env.BOT_PREFIX +
        " assignLireEcrireBasiques categoryID @role oui|non|null` Permet d'assigner/supprimer/réinitialiser les permissions basiques de lecture écriture sur tous les channels d'une catégorie pour un rôle spécifique. Utile quand les permissions des channels ne sont pas synchro avec la catégorie"+
        "\n`"+
          process.env.BOT_PREFIX +
          " kickAll`. Expulse tous les membres du serveur. Commande réservée aux administrateurs. Expulse toute personne qui tape la commande sans être admin.\n\n"
      )
      .catch(console.error);
  }
  msg.channel
    .send(
      "\n`" +
        process.env.BOT_PREFIX +
        " export`. Exporte tout le channel dans lequel la commande est tapée, dans un html lisible offline. **Seuls ceux ayant un rôle >= Enseignant** peuvent taper cette commande n'importe où." +
        "\n`" +
        process.env.BOT_PREFIX +
        " joinVocal`. Pour les étudiants, crée ou rejoint le channel vocal de l'UE correspondant au channel texte, auquel seuls les étudiants de l'UE ont accès. Pour les enseignants, crée un amphi vocal et textuel que tout le monde peut rejoindre. Si vous rajoutez `@NOM_UE` à la fin de la commande, crée un amphi visible seulement par vous, les étudiants de l'UE et tous les enseignants (ppur faciliter les cours à plusieurs enseignants)." +
        "\n`" +
        process.env.BOT_PREFIX +
        " pin messageID`. Permet d'ajouter un message à la liste des messages pin (sans donner la permission `MANAGE_MESSAGES`)" +
        "\n`" +
        process.env.BOT_PREFIX +
        " unpin messageID`. Permet de supprimer un message de la liste des messages pin (sans donner la permission `MANAGE_MESSAGES`)" +
        "\n\n`" +
        process.env.BOT_PREFIX +
        " author` Affiche des informations diverses sur l'auteur de ce bot"
    )
    .catch(console.error);
};

/** Ci après des liste de permissions utilisées lors de la création de channels */
/** https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS */

let toutesPermissions = new Discord.Permissions([
  "CREATE_INSTANT_INVITE",
  "KICK_MEMBERS",
  "BAN_MEMBERS",
  "STREAM",
  "MANAGE_CHANNELS",
  "MANAGE_GUILD",
  "ADD_REACTIONS",
  "VIEW_AUDIT_LOG",
  "PRIORITY_SPEAKER",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "USE_EXTERNAL_EMOJIS",
  "CONNECT",
  "SPEAK",
  "MUTE_MEMBERS",
  "DEAFEN_MEMBERS",
  "MOVE_MEMBERS",
  "USE_VAD",
  "CHANGE_NICKNAME",
  "MANAGE_NICKNAMES",
  "MANAGE_ROLES",
  "MANAGE_WEBHOOKS",
  "MANAGE_EMOJIS",
  "VIEW_GUILD_INSIGHTS",
]);

let permissionsLireEcrireBasiques = new Discord.Permissions([
  "ADD_REACTIONS",
  "STREAM",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "CONNECT",
  "SPEAK",
  "USE_VAD",
]);

let permissionsLireEcrireProf = new Discord.Permissions([
  "ADD_REACTIONS",
  "PRIORITY_SPEAKER",
  "STREAM",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "CONNECT",
  "SPEAK",
  "USE_VAD",
]);

/**
 *
 * @param Permissions
 * @param ouiOuNonOuNull
 * @returns module:"discord.js".PermissionsOverwriteOption
 */
function createOverwrite(
  /** module:"discord.js".Permissions */ Permissions,
  ouiOuNonOuNull
) {
  let /** module:"discord.js".PermissionsOverwriteOption */ dict = [];
  Permissions.toArray().forEach(function (perm) {
    dict[perm] = ouiOuNonOuNull;
  });
  return dict;
}

module.exports.toutesPermissions = toutesPermissions;

module.exports.permissionsLireEcrireBasiques = permissionsLireEcrireBasiques;

module.exports.permissionsLireEcrireProf = permissionsLireEcrireProf;

module.exports.toutesPermissionsOverwrite = function (ouiOuNonOuNull) {
  return createOverwrite(toutesPermissions, ouiOuNonOuNull);
};

module.exports.permissionsLireEcrireBasiquesOverwrite = function (
  ouiOuNonOuNull
) {
  return createOverwrite(permissionsLireEcrireBasiques, ouiOuNonOuNull);
};

module.exports.permissionsLireEcrireProfOverwrite = function (ouiOuNonOuNull) {
  return createOverwrite(permissionsLireEcrireProf, ouiOuNonOuNull);
};
