require("dotenv").config();

/**
 *
 *
 * MONITORING
 *
 *
 * */
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

/**
 *
 *
 * Variables d'environnement
 *
 *
 * */
[
  ["APP", process.env.APP],
  ["BOT_PREFIX", process.env.BOT_PREFIX],
  ["BOT_URL", process.env.BOT_URL],
  ["BOT_TOKEN", process.env.BOT_TOKEN],
  ["SERVER_ID", process.env.SERVER_ID],
  ["CHANNEL_ADMIN_ID", process.env.CHANNEL_ADMIN_ID],
  ["ROLE_ENSEIGNANT_ID", process.env.ROLE_ENSEIGNANT_ID],
  ["ROLE_ETUDIANT_ID", process.env.ROLE_ETUDIANT_ID],
  ["ROLE_ANCIEN_ETUDIANT_ID", process.env.ROLE_ANCIEN_ETUDIANT_ID],
  ["ROLE_VACANCES_ENSEIGNANT_ID", process.env.ROLE_VACANCES_ENSEIGNANT_ID],
  ["BOT_PREFIX", process.env.BOT_PREFIX],
  ["CATEGORY_AMPHI", process.env.CATEGORY_AMPHI],
  ["WEB_LISTEN", process.env.WEB_LISTEN],
  ["LOG_FILE", process.env.LOG_FILE],
  ["CRON_SECRET", process.env.CRON_SECRET],
  ["DISCORD_LISTEN", process.env.DISCORD_LISTEN]
].forEach(function (env) {
  if (typeof env[1] === "undefined" || env[1] === "") {
    console.error("La variable d'env " + env[0] + " n'est pas définie !");
    process.exit(-1);
  }
});
if (typeof process.env.VACANCES === "undefined" || process.env.VACANCES === "")
  process.env.VACANCES = "0";
if (typeof process.env.BOT_URL === "undefined" || process.env.BOT_URL === "")
  process.env.BOT_URL = "l'url publique du bot n'est pas définie";
if (
  typeof process.env.LIEN_INVITATION_DISCORD === "undefined" ||
  process.env.LIEN_INVITATION_DISCORD === ""
)
  process.env.LIEN_INVITATION_DISCORD = "pas de lien d'invitation";

let createError = require("http-errors");
let express = require("express");
let app = express();
let path = require("path");
app.use(express.static(path.join(__dirname, "public")));
/**
 *
 *
 * PARTIE DISCORD
 *
 *
 * */
let Discord = require("discord.js");

const intents = new Discord.Intents([
  Discord.Intents.NON_PRIVILEGED,
  Discord.Intents.PRIVILEGED,
]);
const client = new Discord.Client({ ws: { intents } });

let rateLimit = require("./Discord/DiscordEvents/rateLimit");

client.on("rateLimit", async (rateLimitInfo) => await rateLimit(rateLimitInfo));

if(process.env.DISCORD_LISTEN === "1")
{
  let ready = require("./Discord/DiscordEvents/ready");
  let guildMemberAdd = require("./Discord/DiscordEvents/guildMemberAdd");
  let message = require("./Discord/DiscordEvents/message");
  let voiceStateUpdate = require("./Discord/DiscordEvents/voiceStateUpdate");
  let presenceUpdate = require("./Discord/DiscordEvents/presenceUpdate");

  /** Un tableau[channelTexte] = channelVocal associé */
  /** Utilisé pour vérifier si channel voix existe déjà pour un chan texte */
  let tableauChannelTexteAChannelVocal = [];

  /** Structure : tableauChannelsVocauxEnCours[member.id] = listedesChannelsIDGenDyn */
  /** Utilisé pour supprimer les chan qui ont été générés dynamiquement */
  let tableauChannelsVocauxEnCours = [];

  /** Quand le bot se lance */
  client.on("ready", function () {
    ready(client);
  });
  /**
   * Quand un utilisateur rejoint le serveur, on lui envoie un message de bienvenue pour lui dire de se connecter au site etu
   */
  client.on("guildMemberAdd", (/** GuildMember */ member) => {
    guildMemberAdd(member);
  });
  /** Si le bot reçoit un message en privé, ou sur l'un des channels qu'il peut voir */
  client.on("message", async (/** module:"discord.js".Message */ msg) => {
    await message(
      msg,
      tableauChannelTexteAChannelVocal,
      tableauChannelsVocauxEnCours
    );
  });

  if(typeof process.env.WATCHED_MEMBERS !== "undefined" && process.env.WATCHED_MEMBERS !== "") {
    let watchedMembers = process.env.WATCHED_MEMBERS.split(",");
    client.on("presenceUpdate", async (
      /** 'module:"discord.js".Presence */ oldPresence,
      /** 'module:"discord.js".Presence */ newPresence) => {
      await presenceUpdate(oldPresence, newPresence, watchedMembers);
      }
    )
  }

  client.on("voiceStateUpdate", async (
    /** module:"discord.js".VoiceState */ oldState,
    /** module:"discord.js".VoiceState */ newState
  ) => {
    await voiceStateUpdate(
      oldState,
      newState,
      tableauChannelTexteAChannelVocal,
      tableauChannelsVocauxEnCours
    );
  });

  if (
    typeof process.env.DISCORD_CHAT_EXPORT_PATH !== "undefined" &&
    typeof process.env.DISCORD_CHAT_EXPORTER_EXE_PATH !== "undefined" &&
    process.env.DISCORD_CHAT_EXPORT_PATH !== "" &&
    process.env.DISCORD_CHAT_EXPORTER_EXE_PATH !== ""
  ) {
    let serveIndex = require("serve-index");
    app.use(
      "/exports",
      express.static("public/exports"),
      serveIndex("public/exports", { icons: true })
    );
  }
}

client.login(process.env.BOT_TOKEN).catch(console.error);

/**
 *
 *
 *  PARTIE WEB
 *
 *
 *  */
if(process.env.WEB_LISTEN === "1") {
  let cookieParser = require("cookie-parser");
// view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "twig");

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  if (
    typeof process.env.SITE_ETU_CLIENT_ID !== "undefined" &&
    process.env.SITE_ETU_CLIENT_ID !== "" &&
    typeof process.env.SITE_ETU_CLIENT_SECRET !== "undefined" &&
    process.env.SITE_ETU_CLIENT_SECRET !== ""
  ) {
    app.use("/connexion", require("./routes/connexion"));
    app.use("/attribuerrole", require("./routes/attribuerrole")(client));
    app.use("/cron/"+process.env.CRON_SECRET, require("./routes/cron")(client));
    app.use("/", require("./routes/home"));
  } else {
    app.get("/", function (req, res) {
      res.send(
        "La connexion avec le site etu n'est pas possible en raison d'une mauvaise configuration du bot, ou alors <a href='https://etu.utt.fr'>le site etu</a> n'est pas accessible. Ressayez plus tard."
      );
    });
  }

}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;