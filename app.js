require("dotenv").config();

const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const serveIndex = require("serve-index");
const Sentry = require("@sentry/node");
const Discord = require("discord.js");
const rateLimit = require("./Discord/DiscordEvents/rateLimit");
const ready = require("./Discord/DiscordEvents/ready");
const guildMemberAdd = require("./Discord/DiscordEvents/guildMemberAdd");
const message = require("./Discord/DiscordEvents/message");
const voiceStateUpdate = require("./Discord/DiscordEvents/voiceStateUpdate");
const presenceUpdate = require("./Discord/DiscordEvents/presenceUpdate");

const connexion = require("./routes/connexion");
const attribuerRole = require("./routes/attribuerRole");
const cron = require("./routes/cron");
const home = require("./routes/home");

/**
 *
 *
 * MONITORING
 *
 *
 * */
// const Tracing = require("@sentry/tracing");

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
  ["DISCORD_LISTEN", process.env.DISCORD_LISTEN],
].forEach((env) => {
  if (!env[1]) {
    console.error(`La variable d'env ${env[0]} n'est pas définie !`);
    process.exit(-1);
  }
});
if (!process.env.VACANCES) process.env.VACANCES = "0";
if (!process.env.BOT_URL)
  process.env.BOT_URL = "l'url publique du bot n'est pas définie";
if (!process.env.LIEN_INVITATION_DISCORD)
  process.env.LIEN_INVITATION_DISCORD = "pas de lien d'invitation";
const nameOverride = {};
/* eslint-disable no-restricted-syntax */
if (process.env.NAME_OVERRIDE) {
  for (const userAndName of process.env.NAME_OVERRIDE.split(",")) {
    const arrayUserAndName = userAndName.split(":");
    nameOverride[arrayUserAndName[0]] = arrayUserAndName[1];
  }
}
let bannedLoginUsers = [];
if (process.env.BANNED_LOGIN_USERS) {
  bannedLoginUsers = process.env.BANNED_LOGIN_USERS.split(",");
}
/* eslint-enable no-restricted-syntax */
/**
 *
 *
 * PARTIE DISCORD
 *
 *
 * */

const intents = [
  Discord.Intents.FLAGS.GUILD_MEMBERS,
  Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  Discord.Intents.FLAGS.GUILD_PRESENCES,
  Discord.Intents.FLAGS.GUILD_MESSAGES,
  Discord.Intents.FLAGS.DIRECT_MESSAGES,
  Discord.Intents.FLAGS.GUILDS
];
const client = new Discord.Client({ intents: intents, partials: ["CHANNEL"] });

if (process.env.WATCH_RATE_LIMIT) {
  client.on("rateLimit", (rateLimitInfo) => rateLimit(rateLimitInfo));
}

const additionalRoles = {}

if (process.env.DISCORD_LISTEN === "1") {
  /** Un tableau[channelTexte] = channelVocal associé */
  /** Utilisé pour vérifier si channel voix existe déjà pour un chan texte */
  const tableauChannelTexteAChannelVocal = [];

  /** Structure : tableauChannelsVocauxEnCours[member.id] = listedesChannelsIDGenDyn */
  /** Utilisé pour supprimer les chan qui ont été générés dynamiquement */
  const tableauChannelsVocauxEnCours = [];

  /** Quand le bot se lance */
  client.on("ready", () => {
    ready(client);
  });
  /**
   * Quand un utilisateur rejoint le serveur, on lui envoie un message de bienvenue pour lui dire de se connecter au site etu
   */
  client.on("guildMemberAdd", (/** import("discord.js").GuildMember */ member) => {
    guildMemberAdd(member);
  });
  /** Si le bot reçoit un message en privé, ou sur l'un des channels qu'il peut voir */
  client.on("messageCreate", async (/** import("discord.js").Message */ msg) => {
    await message(
      msg,
      tableauChannelTexteAChannelVocal,
      tableauChannelsVocauxEnCours
    );
  });

  if (process.env.WATCHED_MEMBERS) {
    const watchedMembers = process.env.WATCHED_MEMBERS.split(",");
    client.on(
      "presenceUpdate",
      async (
        /** 'import("discord.js").Presence */ oldPresence,
        /** 'import("discord.js").Presence */ newPresence
      ) => {
        await presenceUpdate(oldPresence, newPresence, watchedMembers);
      }
    );
  }

  client.on(
    "voiceStateUpdate",
    async (
      /** import("discord.js").VoiceState */ oldState,
      /** import("discord.js").VoiceState */ newState
    ) => {
      await voiceStateUpdate(
        oldState,
        newState,
        tableauChannelTexteAChannelVocal,
        tableauChannelsVocauxEnCours
      );
    }
  );
}

client.login(process.env.BOT_TOKEN).catch(console.error);

/**
 *
 *
 *  PARTIE WEB
 *
 *
 *  */
const app = express();
app.use(express.static(path.join(__dirname, "public")));
if (process.env.WEB_LISTEN === "1") {
  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "twig");

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  if (process.env.SITE_ETU_CLIENT_ID && process.env.SITE_ETU_CLIENT_SECRET) {
    app.use("/connexion", connexion);
    app.use(
      "/attribuerrole",
      attribuerRole(client, nameOverride, bannedLoginUsers, additionalRoles)
    );
    app.use(
      `/cron/${process.env.CRON_SECRET}`,
      cron(client, nameOverride, bannedLoginUsers, additionalRoles)
    );
    app.use("/", home);
  } else {
    app.get("/", (req, res) => {
      res.send(
        "La connexion avec le site etu n'est pas possible en raison d'une mauvaise configuration du bot, ou alors <a href='https://etu.utt.fr'>le site etu</a> n'est pas accessible. Ressayez plus tard."
      );
    });
  }

  if (
    process.env.DISCORD_CHAT_EXPORT_PATH &&
    process.env.DISCORD_CHAT_EXPORTER_EXE_PATH
  ) {
    app.use(
      "/exports",
      express.static("public/exports"),
      serveIndex("public/exports", { icons: true })
    );
  }
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
