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
        ` :warning:  Erreur. La syntaxe est \`${process.env.BOT_PREFIX} addUEs categorie texte | vocal | lesDeux\`.`
      )
      .catch(console.error);
  } else {
    /** Si tout va bien */
    /** RT:RE12,RE16;GI:MT14,... */
    let ues = [];
    const ues_list = process.env.UES_LIST;
    for (const ues_branche of ues_list.split(";")) {
      if (ues_branche.split(":")[0].toUpperCase() === parametres[2].toUpperCase()) {
        ues = ues_branche.split(":")[1].split(",");
      }
    }

    /** RT:Cat1,Cat2:Cperf;GI */
    let categories = [];
    let cperf = "";
    const configs = process.env.CATEGORIES_LIST;
    for (const config of configs.split(";")) {
      if (config.split(":")[0].toUpperCase() === parametres[2].toUpperCase()) {
        categories = config.split(":")[1].split(",");
        cperf = config.split(":")[2];
      }
    }


    if (ues.length === 0 || categories.length === 0) {
      msg.reply(" :warning: Aucune branche trouvée !").catch(console.error);
    } else {
      const roles = (await msg.guild.roles.fetch());
      let channelsCounts = [];
      for (const categorie in categories) {
        channelsCounts[categorie] = msg.guild.channels.cache.get(categories[categorie]).children.size;
      }

      let i = 0;
      const maxSize = 50;
      for (const ue of ues) {
        const role = await roles.find(
          (roleToTest) =>
            roleToTest.name.toUpperCase() ===
            ue.toUpperCase()
        );
        if(!role) {
          msg.channel.send(` :grey_question: Pas de rôle pour ${ue}`);
        }
        else {
          while (channelsCounts[i] + parametres[3].toLowerCase() === "lesdeux" ? 2 : 1 > maxSize && i < categories.length) {
            i = i + 1;
          }
          if(i >= categories.length) {
            msg.reply(` :bangbang: Limite de canaux par catégories atteinte (maximum ${maxSize}) pour toutes les catégories spécifiées. Arrêt de la création de canaux.`).catch(console.error);
            return;
          }
          if (
            parametres[3].toLowerCase() === "texte" ||
            parametres[3].toLowerCase() === "lesdeux"
          ) {
            if(!msg.guild.channels.cache.find(channel => channel.name.toLowerCase() === ue.toLowerCase())) {
              msg.guild.channels
                .create(ue.toLowerCase(), {
                  parent: categories[i]
                })
                .then((channel) => {
                  channelsCounts[i] += 1;
                  channel.permissionOverwrites.edit(msg.guild.roles.everyone, discordUtils.toutesPermissionsOverwrite(false));
                  channel.permissionOverwrites.edit(role, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
                  if(cperf.length > 0) {
                    channel.permissionOverwrites.edit(cperf, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
                  }
                  channel.send(
                    `Bonjour <@&${
                      role.id
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
            if(!msg.guild.channels.cache.find(channel => channel.name.toLowerCase() === ue.toLowerCase() + " - vocal")) {
              msg.guild.channels
                .create(`${ue.toLowerCase()} - vocal`, {
                  parent: categories[i],
                  type: "GUILD_VOICE",
                  userLimit: 99
                }).then((channel => {
                  channelsCounts[i] += 1;
                  channel.permissionOverwrites.edit(
                    msg.guild.roles.everyone,
                    discordUtils.toutesPermissionsOverwrite(false)
                  );
                  channel.permissionOverwrites.edit(
                    role.id,
                    discordUtils.permissionsLireEcrireBasiquesOverwrite(true)
                  );
                  if (cperf.length > 0) {
                    channel.permissionOverwrites.edit(
                      cperf,
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
              msg.channel.send(` :zzz: Le canal vocal ${ue.toLowerCase()  } - vocal existe déjà.`)
            }
          }
        }
      }
    }
  }
};
