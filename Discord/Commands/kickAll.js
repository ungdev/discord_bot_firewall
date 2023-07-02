const { Permissions } = require("discord.js");
const discordUtils = require("../discordUtils");

module.exports = async function kickAll(
  /** import("discord.js").Message */ msg,
  /** Array<String> */ parametres
) {
  if ((await msg.member.fetch()).permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    if (parametres.length < 3)
      msg
        .reply(
          `@everyone :warning: Cette commande est destructrice. Elle expulsera toute les personnes / bot / ... ayant un rôle inférieur au bot, ou n'étant pas admin. Tapez \`${process.env.BOT_PREFIX} kickall SERVER_ID\` pour confirmer.\n\n@everyone Surveillez !`
        )
        .catch(console.error);
    else if (parametres[2] === msg.guild.id) {
      msg
        .reply(
          "@everyone Lancement de l'expulsion. :clock1: Cette commande peut être longue, le bot enverra un message quand ça sera fini."
        )
        .catch(console.error);
      await msg.channel.send(
        `Il y a ${(await msg.guild.fetch()).memberCount} membres`
      );
      let compteur = 0;
      (await msg.guild.members.fetch()).forEach((membre) => {
        if (!membre.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
          membre.kick("commande kickall").catch(console.error);
          compteur += 1;
        } else
          msg.channel
            .send(`L'utilisateur ${discordUtils.getUsername(membre)} n'a pas pu être expulsé.`)
            .catch(console.error);
      });
      await msg
        .reply(
          ` :white_check_mark: ${compteur} utilisateurs ont été expulsés. Il reste ${(
            await msg.guild.members.fetch()
          ).size
          } membres`
        )
        .catch(console.error);
    } else msg.reply("L'ID ne correspond pas.").catch(console.error);
  } else {
    msg
      .reply(
        " :octagonal_sign: Vous avez tenté d'expulser tout le monde sans être administrateur. Vous allez être expulsé."
      )
      .catch(console.error);
    msg.member
      .kick("A utilisé la commande kickall sans avoir les droits")
      .catch(console.error);
    msg.author
      .send(
        ":octagonal_sign: Vous avez tenté d'expulser tout le monde sans être administrateur. Vous avez été expulsé."
      )
      .catch(console.error);
    (await msg.guild.channels.resolve(process.env.CHANNEL_ADMIN_ID)).send(
      `@everyone L'utilisateur ${msg.member.nickname} / ${discordUtils.getUsername(msg.author)} a été expulsé.`
    );
  }
};
