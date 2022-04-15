const utils = require("../../utils");
const discordUtils = require("../discordUtils");

const exportChannel = require("../Commands/export");
const joinVocal = require("../Commands/joinVocal");
const listDynVoc = require("../Commands/listDynVoc");
const pin = require("../Commands/pin");
const unpin = require("../Commands/unpin");
const listAnon = require("../Commands/listAnon");
const sendAnon = require("../Commands/sendAnon");
const { getUserFromGuild } = require("../discordUtils");

const { Permissions } = require("discord.js");
const {author} = require("../../utils");


// Commandes réservées aux admins qui ne prennent pas de paramètre additionnel
const adminCommandsNoArgs = {
  "checksameroles": require("../Commands/checkSameRoles"),
  "delsameroles": require("../Commands/delSameRoles"),
  "getzeroone": require("../Commands/getZeroOne"),
  "geturl": require("../Commands/getUrl"),
  "getmemberroles": require("../Commands/getMemberRoles"),
  "setroles": require("../Commands/setRoles"),
  "removeallfromrole" : require("../Commands/removeAllFromRole"),
}

// Commandes réservées aux admins qui ne prennent des paramètres additionnels
const adminCommands = {
  "delue": require("../Commands/delUE"),
  "delues": require("../Commands/delUEs"),
  "addue": require("../Commands/addUE"),
  "addues": require("../Commands/addUEs"),
  "removeallfromrole": require("../Commands/removeAllFromRole"),
  "kickall": require("../Commands/kickAll"),
  "getnb": require("../Commands/getNb"),
  "getroles": require("../Commands/getRoles"),
  "assignrole": require("../Commands/assignRole"),
  "assignlireecrirebasiques": require("../Commands/assignLireEcrireBasiques"),
}

const commandesPubliques = ["export", "joinvocal", "author", "pin", "unpin"];

module.exports = async function message(
  /** import("discord.js").Message */ msg,
  tableauChannelTexteAChannelVocal,
  tableauChannelsVocauxEnCours
) {
  if (
    msg.content.toLowerCase().startsWith(process.env.BOT_PREFIX.toLowerCase())
  ) {
    /** On découpe la ligne de commande par les espaces */
    /** index 0 : le préfixe, index 1 : la commande, index 2,3,... : les vrais paramètres */
    const parametres = msg.content.split(" ");
    let cmdName = parametres[1].toLowerCase();
    if (parametres.length === 1) cmdName = "help";
    if (msg.channel.id === process.env.CHANNEL_ADMIN_ID) {
      if (adminCommands[cmdName] !== undefined) {
        await adminCommands[cmdName](msg, parametres);
      } else if (adminCommandsNoArgs[cmdName] !== undefined) {
        await adminCommandsNoArgs[cmdName](msg);
      } else if (cmdName === "listdynvoc") {
        await listDynVoc(msg, tableauChannelTexteAChannelVocal);
      } else if (!commandesPubliques.includes(parametres[1].toLowerCase())) {
        cmdName = "help";
      }
    }
    if (msg.channel.type !== "DM") {
      switch (cmdName) {
        case "export":
          await exportChannel(msg);
          break;
        case "pin":
          await pin(msg, parametres);
          break;
        case "unpin":
          await unpin(msg, parametres);
          break;
        case "joinvocal":
          await joinVocal(
            msg,
            tableauChannelTexteAChannelVocal,
            tableauChannelsVocauxEnCours
          );
          break;
        case "author":
          msg.channel.send(author).catch(console.error);
          break;
        default:
          if (adminCommands[cmdName] === undefined && adminCommandsNoArgs[cmdName] === undefined) {
            await discordUtils.help(msg);
          }
          break;
      }
    }
    if (msg.channel.type === "DM") {
      const anonymousChannels = {};
      const currentUserAnonymousChannels = {};
      let guildMember;
      if (process.env.ANONYMOUS_CHANNELS) {
        const /** import("discord.js").Guild */ guild =
            await msg.client.guilds.resolve(process.env.SERVER_ID);
        guildMember = await getUserFromGuild(msg.author.tag, guild);
        /* eslint-disable no-restricted-syntax, no-await-in-loop */
        for await (const chan of process.env.ANONYMOUS_CHANNELS.split(",")) {
          const tableau = chan.split(":");
          anonymousChannels[tableau[0]] = tableau[1];
          const /** import("discord.js").Channel */ channel =
              await guild.channels.resolve(tableau[1]);
          if (tableau.length === 2) {
            if (
              await channel.permissionsFor(guildMember).has(Permissions.FLAGS.SEND_MESSAGES)
            ) {
              currentUserAnonymousChannels[tableau[0]] = tableau[1];
            }
          } else if (
            (await guildMember.roles.cache.get(tableau[2])) !== undefined
          ) {
            currentUserAnonymousChannels[tableau[0]] = tableau[1];
          }
        }
        /* eslint-enable no-restricted-syntax, no-await-in-loop */
      }
      switch (cmdName) {
        case "sendanon":
          await sendAnon(
            msg,
            parametres,
            currentUserAnonymousChannels,
            guildMember
          );
          break;
        case "listanon":
          await listAnon(msg, currentUserAnonymousChannels);
          break;
        case "author":
          msg.channel.send(utils.author).catch(console.error);
          break;
        default:
          await discordUtils.help(msg);
          break;
      }
    }
  }
};
