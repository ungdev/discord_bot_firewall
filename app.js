require("dotenv").config();

/**
 *
 *
 * PARTIE DISCORD
 *
 *
 * */
let Discord = require("discord.js");
const client = new Discord.Client();
let ready = require("./Discord/DiscordEvents/ready");
let guildMemberAdd = require("./Discord/DiscordEvents/guildMemberAdd");
let message = require("./Discord/DiscordEvents/message");
let voiceStateUpdate = require("./Discord/DiscordEvents/voiceStateUpdate");

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

client.on("voiceStateUpdate", async (
  /** module:"discord.js".VoiceState */ oldState,
  /** module:"discord.js".VoiceState */ newState,
) => {
  await voiceStateUpdate(oldState, newState, tableauChannelTexteAChannelVocal, tableauChannelsVocauxEnCours);
});

if (process.env.BOT_TOKEN) {
  /** On connecte le BOT à discord */
  client.login(process.env.BOT_TOKEN).catch(console.error);
}

/**
 *
 *
 *  PARTIE WEB
 *
 *
 *  */
let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let serveIndex = require("serve-index");
let app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");

//app.use(logger(process.env.APP));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/connexion", require("./routes/connexion"));
app.use("/attribuerrole", require("./routes/attribuerrole")(client));
app.use(
  "/exports",
  express.static("public/exports"),
  serveIndex("public/exports", { icons: true })
);
app.use("/", require("./routes/home"));

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