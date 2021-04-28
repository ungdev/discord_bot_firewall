let utils = require("../../utils");
let discordUtils = require("../discordUtils");

let addUe = require("../Commands/addUE");
let assignLireEcrireBasiques = require("../Commands/assignLireEcrireBasiques");
let delUe = require("../Commands/delUE");
let delUEs = require("../Commands/delUEs");
let exportChannel = require("../Commands/export");
let getNb = require("../Commands/getNb");
let getRoles = require("../Commands/getRoles");
let getUrl = require("../Commands/getUrl");
let getZeroOne = require("../Commands/getZeroOne");
let joinVocal = require("../Commands/joinVocal");
let kickAll = require("../Commands/kickAll");
let listDynVoc = require("../Commands/listDynVoc");
let pin = require("../Commands/pin");
let unpin = require("../Commands/unpin");
let setRoles = require("../Commands/setRoles");
let getMemberRoles = require("../Commands/getMemberRoles");
let assignRole = require("../Commands/assignRole");
let removeAllFromRole = require("../Commands/removeAllFromRole");
let checkSameRoles = require("../Commands/checkSameRoles");
let delSameRoles = require("../Commands/delSameRoles");
let listAnon = require("../Commands/listAnon");
let sendAnon = require("../Commands/sendAnon");
const { getUserFromGuild } = require("../discordUtils");

let commandesAdmin = [
  "delue",
  "delues",
  "addue",
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

let commandesPubliques = ["export", "joinvocal", "author", "pin", "unpin"];

module.exports = async function (
  /** module:"discord.js".Message */ msg,
  tableauChannelTexteAChannelVocal,
  tableauChannelsVocauxEnCours
) {
  if (
    msg.content.toLowerCase().startsWith(process.env.BOT_PREFIX.toLowerCase())
  ) {
    /** On découpe la ligne de commande par les espaces */
    /** index 0 : le préfix, index 1 : la commande, index 2,3,... : les vrais paramètres */
    let parametres = msg.content.split(" ");
    if (parametres.length === 1) parametres[1] = "help";
    if (msg.channel.id === process.env.CHANNEL_ADMIN_ID) {
      switch (parametres[1].toLowerCase()) {
        case "addue":
          await addUe(msg, parametres);
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
    if (msg.channel.type !== "dm") {
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
    if (msg.channel.type === "dm") {
      let anonymousChannels = {};
      let currentUserAnonymousChannels = {};
      let guildMember;
      if(process.env.ANONYMOUS_CHANNELS) {
        let /** module:"discord.js".Guild */ guild = await msg.client.guilds.resolve(process.env.SERVER_ID);
        guildMember = await getUserFromGuild(msg.author.tag, guild);
        for (const chan of process.env.ANONYMOUS_CHANNELS.split(",")) {
          let tableau = chan.split(":");
          anonymousChannels[tableau[0]] = tableau[1];
          let /** module:"discord.js".Channel */ channel = await guild.channels.resolve(tableau[1]);
          if(tableau.length === 2) {
            if(channel.permissionsFor(guildMember).has("SEND_MESSAGES")) {
              currentUserAnonymousChannels[tableau[0]] = tableau[1];
            }
          }
          else {
            if(guildMember.roles.cache.find((role) => role.id === tableau[2])) {
              currentUserAnonymousChannels[tableau[0]] = tableau[1];
            }
          }
        }
      }
      switch (parametres[1].toLowerCase()) {
        case "sendanon":
          await sendAnon(msg, parametres, currentUserAnonymousChannels, guildMember);
          break;
        case "listanon":
          await listAnon(msg, currentUserAnonymousChannels);
          break;
        case "helpanon":
          await discordUtils.helpAnon(msg);
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
