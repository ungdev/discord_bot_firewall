let utils = require("../../utils");
let discordUtils = require("../discordUtils");

let addUe = require("../Commands/addUE");
let assignLireEcrireBasiques = require("../Commands/assignLireEcrireBasiques");
let delUe = require("../Commands/delUE");
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

let commandesAdmin = [
  "delue",
  "addue",
  "kickall",
  "getnb",
  "getroles",
  "getzeroone",
  "geturl",
  "listdynvoc",
  "assignlireecrirebasiques",
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
      msg
        .reply(
          " :octagonal_sign: Je ne prends aucune commande en Message Privé !"
        )
        .catch(console.error);
      msg.channel.send(utils.author).catch(console.error);
    }
  }
};
