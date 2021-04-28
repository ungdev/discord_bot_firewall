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
          " delUEs <categoryID> vocal | tout`. Idem que la commande `delUE` mais sur tous les channels d'une catégorie." +
          "\n`" +
          process.env.BOT_PREFIX +
          " getNb @ROLE|role_id`. Récupère le nombre de personnes dans le rôle. Le rôle doit exister." +
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
          " assignLireEcrireBasiques channelID|categoryID @role oui|non|null` Permet d'assigner/supprimer/réinitialiser les permissions basiques de lecture écriture sur tous les channels d'une catégorie pour un rôle spécifique. Utile quand les permissions des channels ne sont pas synchro avec la catégorie" +
          "\n`" +
          process.env.BOT_PREFIX +
          " kickAll`. Expulse tous les membres du serveur. **Commande réservée aux administrateurs.** Expulse toute personne qui tape la commande sans être admin." +
          "\n`" +
          process.env.BOT_PREFIX +
          " removeAllFromRole @role`. Prend toutes les personnes ayant le rôle et leur retire. Permet de s'assurer que plus personne n'a un rôle précis."
      )
      .catch(console.error);
    msg.channel
      .send(
        "\n`"+
        process.env.BOT_PREFIX +
        " assignRole @membre @role ajouter|supprimer`. Ajoute ou supprime un rôle pour un membre, même si ce dernier n'est pas connecté (utile pour les serveurs > 1 000 membres). **Commande réservée aux administrateurs.**" +
        "\n`" +
        process.env.BOT_PREFIX +
        " setRoles @membre @role1 @role2 ...`. Efface tous les précédents rôles de l'utilisateur et lui affecte ceux indiqués, même si ce dernier n'est pas connecté (utile pour les serveurs > 1 000 membres). Si aucun rôle n'est précisé, efface tous les rôles de l'utilisateur. **Commande réservée aux administrateurs.**" +
        "\n`" +
        process.env.BOT_PREFIX +
        " getMemberRoles @membre`. Affiche la liste des rôles d'un membre, même si ce dernier n'est pas connecté (utile pour les serveurs > 1 000 membres)." +
        "\n`" +
        process.env.BOT_PREFIX +
        " checkSameRoles`. Affiche la liste des rôles présents plusieurs fois (même nom sans tenir compte de la casse)." +
        "\n`" +
        process.env.BOT_PREFIX +
        " delSameRoles`. Supprime les rôles présents plusieurs fois (même nom sans tenir compte de la casse) pour n'en garder qu'un.\n\n"
      ).catch(console.log);
  }
  if(msg.channel.type !== "dm") {
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
        "\n\n`"
      )
      .catch(console.error);
  }
  else {
      msg.channel
        .send(
          "\n`" +
          process.env.BOT_PREFIX +
          " listAnon`. pour lister les canaux dans lesquels vous pouvez écrire en anonyme" +
          "\n`" +
          process.env.BOT_PREFIX +
          " sendAnon channel message`. Envoie un message anonyme (avec formatage et emojis) sur le channel listé avec listAnon. Veillez à bien mettre un caractère espace entre le channel et le début du message (pas de saut de ligne direct). *Les administrateurs pourront à tout moment lever votre anonymat grâce à des fichiers logs.*"
        )
        .catch(console.error);
  }
  msg.channel
    .send(
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

module.exports.getUserFromGuild = async function(/** string */ discordUsername, /** module:"discord.js".Guild */ guild) {
  const username = discordUsername.split("#")[0];
  const discriminant = discordUsername.split("#")[1];
  return (await guild.members.fetch()).find(
    (user) =>
      user.user.username === username &&
      user.user.discriminator === discriminant
  );
}

module.exports.assignPerm = function (
  /** module:"discord.js".GuildChannel */ channel,
  /** module:"discord.js".Role */ role,
  ouiOuNonOuNull
) {
  switch (ouiOuNonOuNull) {
    case "oui":
      channel
        .updateOverwrite(
          role,
          module.exports.permissionsLireEcrireBasiquesOverwrite(true)
        )
        .catch(console.error);
      break;
    case "non":
      channel
        .updateOverwrite(
          role,
          module.exports.permissionsLireEcrireBasiquesOverwrite(false)
        )
        .catch(console.error);
      break;
    case "null":
      channel
        .updateOverwrite(
          role,
          module.exports.permissionsLireEcrireBasiquesOverwrite(null)
        )
        .catch(console.error);
      break;
  }
};

module.exports.delUE = async function (
  /** module:"discord.js".GuildChannel */ channelToDelete,
  /** module:"discord.js".Message */ msg,
  /** String */ scope
) {
  if (scope.toLowerCase() === "vocal") {
    msg.guild.channels.cache
      .find(
        (channel) =>
          (channel.name
            .toLowerCase()
            .includes(" " + channelToDelete.name.toLowerCase()) ||
            channel.name
              .toLowerCase()
              .includes(channelToDelete.name.toLowerCase() + " ")) &&
          channel.type === "voice"
      )
      .delete("Demandé par " + msg.author.tag + " " + msg.author.username)
      .catch(console.error);
  }
  if (scope.toLowerCase() === "tout") {
    (await msg.guild.roles.fetch()).cache
      .find(
        (role) => role.name.toUpperCase() === channelToDelete.name.toUpperCase()
      )
      .delete("Demandé par " + msg.author.tag + " " + msg.author.username)
      .catch(console.error);
    channelToDelete
      .delete("Demandé par " + msg.author.tag + " " + msg.author.username)
      .catch(console.error);
  }
  msg.channel
    .send(
      ":white_check_mark: Ce que vous avez demandé a été effacé pour " +
        channelToDelete.name +
        " !"
    )
    .catch(console.error);
};
