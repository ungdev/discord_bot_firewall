const utils = require("../../utils");
const discordUtils = require("../discordUtils");

const addUe = require("../Commands/addUE");
const assignLireEcrireBasiques = require("../Commands/assignLireEcrireBasiques");
const delUe = require("../Commands/delUE");
const delUEs = require("../Commands/delUEs");
const exportChannel = require("../Commands/export");
const getNb = require("../Commands/getNb");
const getRoles = require("../Commands/getRoles");
const getUrl = require("../Commands/getUrl");
const getZeroOne = require("../Commands/getZeroOne");
const joinVocal = require("../Commands/joinVocal");
const kickAll = require("../Commands/kickAll");
const listDynVoc = require("../Commands/listDynVoc");
const pin = require("../Commands/pin");
const unpin = require("../Commands/unpin");
const setRoles = require("../Commands/setRoles");
const getMemberRoles = require("../Commands/getMemberRoles");
const assignRole = require("../Commands/assignRole");
const removeAllFromRole = require("../Commands/removeAllFromRole");
const checkSameRoles = require("../Commands/checkSameRoles");
const delSameRoles = require("../Commands/delSameRoles");
const listAnon = require("../Commands/listAnon");
const sendAnon = require("../Commands/sendAnon");
const addUes = require("../Commands/addUEs");
const { getUserFromGuild, getUsername } = require("../discordUtils");

const { Permissions, ChannelType } = require("discord.js");

const commandesAdmin = [
  "delue",
  "delues",
  "addue",
  "addues",
  "removeallfromrole",
  "kickall",
  "getnb",
  "getroles",
  "getzeroone",
  "geturl",
  "listdynvoc",
  "assignlireecrirebasiques",
  "assignrole",
  "getmemberroles",
  "setroles",
  "checksameroles",
  "delsameroles",
];

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
    /** index 0 : le préfix, index 1 : la commande, index 2,3,... : les vrais paramètres */
    const parametres = msg.content.split(" ");
    if (parametres.length === 1) parametres[1] = "help";
    if (msg.channel.id === process.env.CHANNEL_ADMIN_ID) {
      switch (parametres[1].toLowerCase()) {
        case "addue":
          await addUe(msg, parametres);
          break;
        case "addues":
          await addUes(msg, parametres);
          break;
        case "delue":
          await delUe(msg, parametres);
          break;
        case "checksameroles":
          await checkSameRoles(msg);
          break;
        case "delsameroles":
          await delSameRoles(msg);
          break;
        case "delues":
          await delUEs(msg, parametres);
          break;
        case "getnb":
          await getNb(msg, parametres);
          break;
        case "getroles":
          await getRoles(msg, parametres);
          break;
        case "getzeroone":
          await getZeroOne(msg);
          break;
        case "assignlireecrirebasiques":
          await assignLireEcrireBasiques(msg, parametres);
          break;
        case "geturl":
          await getUrl(msg);
          break;
        case "kickall":
          await kickAll(msg, parametres);
          break;
        case "listdynvoc":
          await listDynVoc(msg, tableauChannelTexteAChannelVocal);
          break;
        case "setroles":
          await setRoles(msg);
          break;
        case "getmemberroles":
          await getMemberRoles(msg);
          break;
        case "assignrole":
          await assignRole(msg, parametres);
          break;
        case "removeallfromrole":
          await removeAllFromRole(msg);
          break;
        default:
          if (!commandesPubliques.includes(parametres[1].toLowerCase())) {
            parametres[1] = "help";
          }
          break;
      }
    }
    if (msg.channel.type !== ChannelType.DM) {
      switch (parametres[1].toLowerCase()) {
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
          msg.channel.send(utils.author).catch(console.error);
          break;
        default:
          if (!commandesAdmin.includes(parametres[1].toLowerCase())) {
            await discordUtils.help(msg);
          }
          break;
      }
    }
    if (msg.channel.type === ChannelType.DM) {
      const anonymousChannels = {};
      const currentUserAnonymousChannels = {};
      let guildMember;
      if (process.env.ANONYMOUS_CHANNELS) {
        const /** import("discord.js").Guild */ guild =
          await msg.client.guilds.resolve(process.env.SERVER_ID);
        guildMember = await getUserFromGuild(getUsername(msg.author), guild);
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
      switch (parametres[1].toLowerCase()) {
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
