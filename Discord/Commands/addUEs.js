const { ChannelType } = require("discord.js");
const discordUtils = require("../discordUtils");

module.exports = async function addUEs(
  /** import("discord.js").Message */ msg,
  /** Array<String> */ parametres
) {
  /** S'il n'y a pas 3 paramètres dont la mention d'un role ni de ce qui doit être créé */
  if (
    parametres.length !== 4
  ) {
    msg
      .reply(
        ` :warning:  Erreur. La syntaxe est \`${process.env.BOT_PREFIX} addUEs <branche> texte | vocal | lesDeux\`.`
      )
      .catch(console.error);
  } else {
    /** Si tout va bien */
    /** RT:RE12,RE16;GI:MT14,... */
    let ues = [];
    const uesPerBranch = process.env.UES_PER_BRANCH;
    for (const currentUEsForBranch of uesPerBranch.split(";")) {
      if (
        currentUEsForBranch.split(":")[0].toUpperCase() ===
        parametres[2].toUpperCase()
      ) {
        ues = currentUEsForBranch.split(":")[1].split(",");
      }
    }

    /** RT:Cat1,Cat2:Cperf;GI */
    let currentCategories = [];
    let currentElectedRole = "";
    const branchCategoriesAndElectedRole = process.env.BRANCH_CATEGORIES_AND_ELECTED_ROLE;
    for (const currentBranchCategoriesAndElectedRole of branchCategoriesAndElectedRole.split(";")) {
      if (currentBranchCategoriesAndElectedRole.split(":")[0].toUpperCase() === parametres[2].toUpperCase()) {
        currentCategories = currentBranchCategoriesAndElectedRole.split(":")[1].split(",");
        currentElectedRoles = currentBranchCategoriesAndElectedRole.split(":")[2].split(",");
      }
    }


    if (ues.length === 0 || currentCategories.length === 0) {
      msg.reply(" :warning: Aucune branche trouvée !").catch(console.error);
    } else {
      const roles = (await msg.guild.roles.fetch());
      const channelsCounts = [];
      for (const category in currentCategories) {
        channelsCounts[category] = msg.guild.channels.cache.get(currentCategories[category]).children.size;
      }

      let i = 0;
      const maxChannelsPerCategory = 50;
      for (const ue of ues) {
        const ueRole = await roles.find(
          (roleToTest) =>
            roleToTest.name.toUpperCase() ===
            ue.toUpperCase()
        );
        if (!ueRole) {
          msg.channel.send(` :grey_question: Pas de rôle pour ${ue}`);
        }
        else {
          while (channelsCounts[i] + parametres[3].toLowerCase() === "lesdeux" ? 2 : 1 > maxChannelsPerCategory && i < currentCategories.length) {
            i = i + 1;
          }
          if (i >= currentCategories.length) {
            msg.reply(` :bangbang: Limite de canaux par catégories atteinte (maximum ${maxChannelsPerCategory}) pour toutes les catégories spécifiées. Arrêt de la création de canaux.`).catch(console.error);
            return;
          }
          if (
            parametres[3].toLowerCase() === "texte" ||
            parametres[3].toLowerCase() === "lesdeux"
          ) {
            if (!msg.guild.channels.cache.find(channel => channel.name.toLowerCase() === ue.toLowerCase())) {
              msg.guild.channels
                .create(ue.toLowerCase(), {
                  parent: currentCategories[i]
                })
                .then((channel) => {
                  channelsCounts[i] += 1;
                  channel.permissionOverwrites.edit(msg.guild.roles.everyone, discordUtils.toutesPermissionsOverwrite(false));
                  channel.permissionOverwrites.edit(ueRole, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
                  for (const currentElectedRole of currentElectedRoles) {
                    channel.permissionOverwrites.edit(currentElectedRole, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
                  }
                  channel.send(
                    `Bonjour <@&${ueRole.id
                    }>, votre channel texte vient d'être créé !`
                  );
                  msg.channel.send(` :white_check_mark: Canal texte ${ue.toLowerCase()} créé`).catch(console.error);
                })
                .catch(console.error);
            } else {
              msg.channel.send(` :zzz: Le canal texte ${ue.toLowerCase()} existe déjà !`);
            }

          }
          /** On crée le vocal avec aucune permission pour @everyone et les permissions de parler/connecter pour le rôle concerné */
          if (
            parametres[3].toLowerCase() === "vocal" ||
            parametres[3].toLowerCase() === "lesdeux"
          ) {
            if (!msg.guild.channels.cache.find(channel => channel.name.toLowerCase() === ue.toLowerCase() + " - vocal")) {
              msg.guild.channels
                .create(`${ue.toLowerCase()} - vocal`, {
                  parent: currentCategories[i],
                  type: ChannelType.GuildVoice,
                  userLimit: 99
                }).then((channel => {
                  channelsCounts[i] += 1;
                  channel.permissionOverwrites.edit(
                    msg.guild.roles.everyone,
                    discordUtils.toutesPermissionsOverwrite(false)
                  );
                  channel.permissionOverwrites.edit(
                    ueRole.id,
                    discordUtils.permissionsLireEcrireBasiquesOverwrite(true)
                  );
                  for (const currentElectedRole of currentElectedRoles) {
                    channel.permissionOverwrites.edit(
                      currentElectedRole,
                      discordUtils.permissionsLireEcrireBasiquesOverwrite(true)
                    );
                  }
                  msg.channel
                    .send(
                      ` :white_check_mark: Canal vocal ${ue.toLowerCase()} - vocal créé`
                    )
                    .catch(console.error);
                }))
                .catch(console.error);
            }
            else {
              msg.channel.send(` :zzz: Le canal vocal ${ue.toLowerCase()} - vocal existe déjà.`)
            }
          }
        }
      }
    }
  }
};
