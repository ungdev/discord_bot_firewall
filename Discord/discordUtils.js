module.exports.help = async function help(
  /** import("discord.js").Message */ msg
) {
  msg
    .reply(
      ":tools: Plusieurs fonctions accessibles. Contacter Ivann LARUELLE, ivann.laruelle@gmail.com, créateur de ce bot, en cas de problème"
    )
    .catch(console.error);
  if (msg.channel.id === process.env.CHANNEL_ADMIN_ID) {
    msg.channel
      .send(
        `\n\n\`${process.env.BOT_PREFIX} addUE @RoleUE <categoryID> texte | vocal | lesDeux\`. Permet de créer les channels texte et voix d'un rôle existant avec les permissions correctes. La catégorie et le rôle doivent déjà exister.` +
          `\n\`${process.env.BOT_PREFIX} addUEs <branche> texte | vocal | lesDeux\` qui, s'ils n'existent pas déjà, crée un chan texte et vocal pour toutes les UEs ayant un rôle existant pour la branche indiquée selon les informations fournies dans \`UES_PER_BRANCH\` et \`BRANCH_CATEGORIES_AND_ELECTED_ROLE\`, et leur affectera les bonnes permissions (rôle de l'UE et éventuellement élus étudiants)`+
          `\n\`${process.env.BOT_PREFIX} delUE #ueASupprimer vocal | tout\`. Supprime les channels texte et voix de l'UE et le rôle. Vous devez tagguer le channel texte de l'UE !` +
          `\n\`${process.env.BOT_PREFIX} delUEs <categoryID> vocal | tout\`. Idem que la commande \`delUE\` mais sur tous les channels d'une catégorie.` +
          `\n\`${process.env.BOT_PREFIX} getNb @ROLE|role_id\`. Récupère le nombre de personnes dans le rôle. Le rôle doit exister.` +
          `\n\`${process.env.BOT_PREFIX} getRoles NombrePersonne\`. Affiche la liste des rôles ne contenant que le nombre de personnes demandé. :clock1: Cette commande peut être longue.` +
          `\n\`${process.env.BOT_PREFIX} getZeroOne\`. Affiche les rôles ayant soit 0 ou 1 personne dedans. :clock1: Cette commande peut être longue.` +
          `\n\`${process.env.BOT_PREFIX} getUrl\`. Affiche les url du serveur web du bot, le lien d'invitation discord` +
          `\n\`${process.env.BOT_PREFIX} listDynVoc\`. Affiche tous les channels textes dans lesquels des vocaux ont été lancés, ainsi que leur catégorie. Utile pour savoir quand lancer une mise à jour du bot.` +
          `\n\`${process.env.BOT_PREFIX} assignLireEcrireBasiques channelID|categoryID @role oui|non|null\` Permet d'assigner/supprimer/réinitialiser les permissions basiques de lecture écriture sur tous les channels d'une catégorie pour un rôle spécifique. Utile quand les permissions des channels ne sont pas synchro avec la catégorie` +
          `\n\`${process.env.BOT_PREFIX} kickAll\`. Expulse tous les membres du serveur. **Commande réservée aux administrateurs.** Expulse toute personne qui tape la commande sans être admin.`
      )
      .catch(console.error);
    msg.channel
      .send(
        `\n\`${process.env.BOT_PREFIX} assignRole @membre @role ajouter|supprimer\`. Ajoute ou supprime un rôle pour un membre, même si ce dernier n'est pas connecté (utile pour les serveurs > 1 000 membres). **Commande réservée aux administrateurs.**` +
          `\n\`${process.env.BOT_PREFIX} setRoles @membre @role1 @role2 ...\`. Efface tous les précédents rôles de l'utilisateur et lui affecte ceux indiqués, même si ce dernier n'est pas connecté (utile pour les serveurs > 1 000 membres). Si aucun rôle n'est précisé, efface tous les rôles de l'utilisateur. **Commande réservée aux administrateurs.**` +
          `\n\`${process.env.BOT_PREFIX} getMemberRoles @membre\`. Affiche la liste des rôles d'un membre, même si ce dernier n'est pas connecté (utile pour les serveurs > 1 000 membres).` +
          `\n\`${process.env.BOT_PREFIX} checkSameRoles\`. Affiche la liste des rôles présents plusieurs fois (même nom sans tenir compte de la casse).` +
          `\n\`${process.env.BOT_PREFIX} removeAllFromRole @role\`. Prend toutes les personnes ayant le rôle et leur retire. Permet de s'assurer que plus personne n'a un rôle précis.` +
          `\n\`${process.env.BOT_PREFIX} delSameRoles\`. Supprime les rôles présents plusieurs fois (même nom sans tenir compte de la casse) pour n'en garder qu'un.\n\n`
      )
      .catch(console.error);
  }
  if (msg.channel.type !== "DM") {
    msg.channel
      .send(
        `\n\`${process.env.BOT_PREFIX} export\`. Exporte tout le channel dans lequel la commande est tapée, dans un html lisible offline. **Seuls ceux ayant un rôle >= Enseignant** peuvent taper cette commande n'importe où.` +
          `\n\`${process.env.BOT_PREFIX} joinVocal\`. Pour les étudiants, crée ou rejoint le channel vocal de l'UE correspondant au channel texte, auquel seuls les étudiants de l'UE ont accès. Pour les enseignants, crée un amphi vocal et textuel que tout le monde peut rejoindre. Si vous rajoutez \`@NOM_UE\` à la fin de la commande, crée un amphi visible seulement par vous, les étudiants de l'UE et tous les enseignants (pour faciliter les cours à plusieurs enseignants).` +
          `\n\`${process.env.BOT_PREFIX} pin messageID\`. Permet d'ajouter un message à la liste des messages pin (sans donner la permission \`MANAGE_MESSAGES\`)` +
          `\n\`${process.env.BOT_PREFIX} unpin messageID\`. Permet de supprimer un message de la liste des messages pin (sans donner la permission \`MANAGE_MESSAGES\`)`
      )
      .catch(console.error);
  } else {
    msg.channel
      .send(
        `\n\`${process.env.BOT_PREFIX} listAnon\`. pour lister les canaux dans lesquels vous pouvez écrire en anonyme` +
          `\n\`${process.env.BOT_PREFIX} sendAnon channel message\`. Envoie un message anonyme (avec formatage et emojis) sur le channel listé avec listAnon. Veillez à bien mettre un caractère espace entre le channel et le début du message (pas de saut de ligne direct). *Les administrateurs pourront à tout moment lever votre anonymat grâce à des fichiers logs.*`
      )
      .catch(console.error);
  }
  msg.channel
    .send(
      `\n\n\`${process.env.BOT_PREFIX} author\` Affiche des informations diverses sur l'auteur de ce bot`
    )
    .catch(console.error);
};

/** Ci après des liste de permissions utilisées lors de la création de channels */
/** https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS */

module.exports.toutesPermissionsOverwrite = function toutesPermissionsOverwrite(
  ouiOuNonOuNull
) {
  return {
    "CREATE_INSTANT_INVITE": ouiOuNonOuNull,
    "KICK_MEMBERS": ouiOuNonOuNull,
    "BAN_MEMBERS": ouiOuNonOuNull,
    "STREAM": ouiOuNonOuNull,
    "MANAGE_CHANNELS": ouiOuNonOuNull,
    "MANAGE_GUILD": ouiOuNonOuNull,
    "ADD_REACTIONS": ouiOuNonOuNull,
    "VIEW_AUDIT_LOG": ouiOuNonOuNull,
    "PRIORITY_SPEAKER": ouiOuNonOuNull,
    "VIEW_CHANNEL": ouiOuNonOuNull,
    "SEND_MESSAGES": ouiOuNonOuNull,
    "SEND_TTS_MESSAGES": ouiOuNonOuNull,
    "MANAGE_MESSAGES": ouiOuNonOuNull,
    "EMBED_LINKS": ouiOuNonOuNull,
    "ATTACH_FILES": ouiOuNonOuNull,
    "READ_MESSAGE_HISTORY": ouiOuNonOuNull,
    "MENTION_EVERYONE": ouiOuNonOuNull,
    "USE_EXTERNAL_EMOJIS": ouiOuNonOuNull,
    "CONNECT": ouiOuNonOuNull,
    "SPEAK": ouiOuNonOuNull,
    "MUTE_MEMBERS": ouiOuNonOuNull,
    "DEAFEN_MEMBERS": ouiOuNonOuNull,
    "MOVE_MEMBERS": ouiOuNonOuNull,
    "USE_VAD": ouiOuNonOuNull,
    "CHANGE_NICKNAME": ouiOuNonOuNull,
    "MANAGE_NICKNAMES": ouiOuNonOuNull,
    "MANAGE_ROLES": ouiOuNonOuNull,
    "MANAGE_WEBHOOKS": ouiOuNonOuNull,
    "MANAGE_EMOJIS_AND_STICKERS": ouiOuNonOuNull,
    "VIEW_GUILD_INSIGHTS": ouiOuNonOuNull
  }
};

module.exports.permissionsLireEcrireBasiquesOverwrite =
  function permissionsLireEcrireBasiquesOverwrite(ouiOuNonOuNull) {
    return {
      "ADD_REACTIONS": ouiOuNonOuNull,
      "STREAM": ouiOuNonOuNull,
      "VIEW_CHANNEL": ouiOuNonOuNull,
      "SEND_MESSAGES": ouiOuNonOuNull,
      "SEND_TTS_MESSAGES": ouiOuNonOuNull,
      "EMBED_LINKS": ouiOuNonOuNull,
      "ATTACH_FILES": ouiOuNonOuNull,
      "READ_MESSAGE_HISTORY": ouiOuNonOuNull,
      "MENTION_EVERYONE": ouiOuNonOuNull,
      "CONNECT": ouiOuNonOuNull,
      "SPEAK": ouiOuNonOuNull,
      "USE_VAD": ouiOuNonOuNull
    }

  };

module.exports.permissionsLireEcrireProfOverwrite =
  function permissionsLireEcrireProfOverwrite(ouiOuNonOuNull) {
    return {
      "ADD_REACTIONS": ouiOuNonOuNull,
      "PRIORITY_SPEAKER": ouiOuNonOuNull,
      "STREAM": ouiOuNonOuNull,
      "VIEW_CHANNEL": ouiOuNonOuNull,
      "SEND_MESSAGES": ouiOuNonOuNull,
      "SEND_TTS_MESSAGES": ouiOuNonOuNull,
      "MANAGE_MESSAGES": ouiOuNonOuNull,
      "EMBED_LINKS": ouiOuNonOuNull,
      "ATTACH_FILES": ouiOuNonOuNull,
      "READ_MESSAGE_HISTORY": ouiOuNonOuNull,
      "MENTION_EVERYONE": ouiOuNonOuNull,
      "CONNECT": ouiOuNonOuNull,
      "SPEAK": ouiOuNonOuNull,
      "USE_VAD": ouiOuNonOuNull
    }

  };

module.exports.getUserFromGuild = async function getUserFromGuild(
  /** string */ discordUsername,
  /** import("discord.js").Guild */ guild
) {
  const username = discordUsername.split("#")[0];
  const discriminant = discordUsername.split("#")[1];
  return guild.members.cache.find(
    (user) =>
      user.user.username === username &&
      user.user.discriminator === discriminant
  );
};

module.exports.assignPerm = function assignPerm(
  /** import("discord.js").GuildChannel */ channel,
  /** import("discord.js").Role */ role,
  ouiOuNonOuNull
) {
  switch (ouiOuNonOuNull) {
    case "oui":
      channel
        .permissionOverwrites.edit(
          role,
          module.exports.permissionsLireEcrireBasiquesOverwrite(true)
        )
        .catch(console.error);
      break;
    case "non":
      channel
        .permissionOverwrites.edit(
          role,
          module.exports.permissionsLireEcrireBasiquesOverwrite(false)
        )
        .catch(console.error);
      break;
    case "null":
      channel
        .permissionOverwrites.edit(
          role,
          module.exports.permissionsLireEcrireBasiquesOverwrite(null)
        )
        .catch(console.error);
      break;
    default:
      break;
  }
};

module.exports.delUE = async function delUE(
  /** import("discord.js").GuildChannel */ channelToDelete,
  /** import("discord.js").Message */ msg,
  /** String */ scope
) {
  if (scope.toLowerCase() === "vocal") {
    msg.guild.channels.cache
      .find(
        (channel) =>
          (channel.name
            .toLowerCase()
            .includes(` ${channelToDelete.name.toLowerCase()}`) ||
            channel.name
              .toLowerCase()
              .includes(`${channelToDelete.name.toLowerCase()} `)) &&
          channel.type === "GUILD_VOICE"
      )
      .delete(`Demandé par ${msg.author.tag} ${msg.author.username}`)
      .catch(console.error);
  }
  if (scope.toLowerCase() === "tout") {
    (await msg.guild.roles.fetch())
      .find(
        (role) => role.name.toUpperCase() === channelToDelete.name.toUpperCase()
      )
      .delete(`Demandé par ${msg.author.tag} ${msg.author.username}`)
      .catch(console.error);
    channelToDelete
      .delete(`Demandé par ${msg.author.tag} ${msg.author.username}`)
      .catch(console.error);
  }
  msg.channel
    .send(
      `:white_check_mark: Ce que vous avez demandé a été effacé pour ${channelToDelete.name} !`
    )
    .catch(console.error);
};


module.exports = async function CreateUeChannel(
    /** import("discord.js").Guild */ guild,
    /** String */ name,
    /** import("discord.js").Role */ role,
    /** String */ category = "",
    /** import("discord.js").ChannelTypes */ channelType = ChannelTypes.GUILD_TEXT
) {
    switch (channelType) {
        case ChannelTypes.GUILD_TEXT:
            guild.channels
                .create(name, {
                    parent: category,
                    reason: "création de salon d'UE"
                })
                .then((channel) => {
                    channel.permissionOverwrites.edit(guild.roles.everyone, discordUtils.toutesPermissionsOverwrite(false));
                    channel.permissionOverwrites.edit(role.id, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
                    channel.send(
                        `Bonjour <@&${
                            role.id
                        }>, votre channel texte vient d'être créé !`
                    );
                }).catch(console.error);
            break;
        case ChannelTypes.GUILD_VOICE:
            guild.channels
                .create(`${name} - vocal`, {
                    reason: "création de vocal d'UE",
                    parent: category,
                    type: "GUILD_VOICE",
                    userLimit: 99
                }).then((channel => {
                channel.permissionOverwrites.edit(guild.roles.everyone, discordUtils.toutesPermissionsOverwrite(false));
                channel.permissionOverwrites.edit(role.id, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
            })).catch(console.error);
            break;
    }
}
