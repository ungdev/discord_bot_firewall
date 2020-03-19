let express = require('express');
let Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios');
let httpBuildQuery = require('http-build-query');
require('dotenv').config();
let router = express.Router();
let baseUrl =  "https://etu.utt.fr";

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

/* GET home page. */
router.get('/', function(req, res, next) {
  let donnees = {
    "client_id":process.env.SITE_ETU_CLIENT_ID,
    "response_type":"code",
    "state":"xyz",
  };
  res.redirect(baseUrl+"/api/oauth/authorize?"+httpBuildQuery(donnees));
});

router.get('/connexion', function(req, res, next) {
  if(req.query.code)
  {
    let donnees = {
      "grant_type": "authorization_code",
      "scopes": "public",
      "code": req.query.code,
      "client_id": process.env.SITE_ETU_CLIENT_ID,
      "client_secret": process.env.SITE_ETU_CLIENT_SECRET
    };
    let access_token="";
    axios.post(baseUrl+"/api/oauth/token?"+httpBuildQuery(donnees))
        .then(function (response) {
          access_token = response.data.access_token.toString();
          if(access_token !== "")
          {
            res.render('formulaire',{token: access_token, lienDiscord: process.env.LIEN_INVITATION_DISCORD});
          }
          else
            res.send("Nous n'avons pas pu vous authentifier. <a href='/'>Revenir au départ</a>");
        });
  }
});

router.get("/attribuerrole", function(req, res, next) {
  if(req.query.site_etu_token && req.query.utilisateur && req.query.discriminant)
  {
    let donnees = {
      "access_token": req.query.site_etu_token
    };
    axios.get(baseUrl+"/api/public/user/account?"+httpBuildQuery(donnees))
        .then(function (response) {
          let membreSiteEtu = response.data.data;
          if(typeof membreSiteEtu.isStudent !== 'undefined')
          {
            let guild = client.guilds.cache.get(process.env.SERVER_ID);
            let membreDiscord = guild.members.cache.find(user => user.user.username === req.query.utilisateur && user.user.discriminator === req.query.discriminant);
            if(membreDiscord)
            {
              let roles = guild.roles.cache;
              let rolesAAttribuer = [];
              let pseudo = capitalize(membreSiteEtu.firstName.toString())+" "+membreSiteEtu.lastName.toString().toUpperCase();
              let rediriger = false;
              if(membreSiteEtu.isStudent)
              {
                rolesAAttribuer.push(process.env.ROLE_ETUDIANT_ID);
                pseudo +=" - "+membreSiteEtu.branch+membreSiteEtu.level;
                let tableauChainesToRoles = membreSiteEtu.uvs;
                tableauChainesToRoles.push(membreSiteEtu.branch);
                for (const chaine of tableauChainesToRoles)
                {
                  let role = roles.find(role => role.name.toUpperCase() === chaine.toString().toUpperCase());
                  if(role)
                    rolesAAttribuer.push(role.id);
                  else{
                    client.channels.cache.get(process.env.CHANNEL_ADMIN_ID).send("Le rôle "+chaine+" va être créé pour l'utilisateur "+membreDiscord.user.tag+" "+pseudo);
                    guild.roles.create({ data: {name: chaine.toString().toUpperCase()}}).catch(console.error);
                    rediriger=true;
                  }
                }
              }
              else
                rolesAAttribuer.push(process.env.ROLE_ENSEIGNANT_ID);
              membreDiscord.setNickname(pseudo).catch(console.error);
              membreDiscord.roles.set(rolesAAttribuer).catch(console.error);
              if(rediriger) {
                  res.send("Vos rôles viennent d'être créé mais ne sont pas encore affectés. <b>Reindiquez-nous votre identifiant</b> afin d'appliquer les modifications en cliquant <a href='/'>ici</a>.")
              }
              res.send("Vos rôles ont été affectés. Si certains manquent, les admins ont été prévenus. Retournez sur ce site plus tard afin d'avoir les rôles à jour.<br>Si d'ici quelques jours vos rôles n'apparaissent pas, merci de nous contacter.<br><br><b>Vous pouvez maintenant fermer cette fenêtre.</b>");
            }
            else
              res.send("Utilisateur discord non trouvé dans le serveur. Avez-vous bien rejoint le serveur Discord ? <a href='/'>Revenir au départ</a>");
          }
          else
            res.send("Il y a eu une erreur à la connection avec le site etu. <a href='/'>Revenir au départ</a>");
    });
  }
  else
  {
    res.send("Le formulaire est incomplet. <a href='/'>Revenir au départ</a>");
  }
});

client.on('ready', () => {
  client.user.setActivity("mettre les gens à leur place", {
    type: "PLAYING",
    url: process.env.BOT_URL
  }).catch(console.error);
});

client.on("guildMemberAdd", (member) => {
  member.send("Bienvenue sur le serveur Discord des étudiants de l'UTT." +
      "\nCeci n'étant pas une zone de non droit, vous devez vous identifier en cliquant ici : "+process.env.BOT_URL+
      "\nVous devez également lire les règles dans le channel `accueil`"+"\n\nEn cas de problème, contacte l'un des administrateurs, visibles en haut à droite.")
});

client.on('message', msg => {
  if (msg.content.startsWith(process.env.BOT_PREFIX) && msg.channel.id === process.env.CHANNEL_ADMIN_ID) {
    let parametres = msg.content.split(" ");
    if(parametres.length !== 3 || !msg.mentions.roles.first())
    {
      msg.reply("Erreur. La syntaxe est `"+process.env.BOT_PREFIX+" @RoleUE <categoryID>`. La catégorie et le rôle doivent déjà exister.").catch(console.error);
    }
    else
    {
      client.guilds.cache.get(process.env.SERVER_ID).channels.create(msg.mentions.roles.first().name.toLowerCase(), {parent: parametres[2], permissionOverwrites:[
          {
            id: msg.guild.roles.everyone,
            deny: 2147483127
          },
          {
            id: msg.mentions.roles.first().id,
            allow: 36961344
          }
        ]}).catch(console.error);
      client.guilds.cache.get(process.env.SERVER_ID).channels.create(msg.mentions.roles.first().name.toLowerCase()+" - vocal", {parent: parametres[2], type: "voice", permissionOverwrites:[
          {
            id: msg.guild.roles.everyone,
            deny: 2147483127
          },
          {
            id: msg.mentions.roles.first().id,
            allow: 36961344
          }
        ]}).catch(console.error);
      msg.reply("Si la catégorie existe, c'est fait !").catch(console.error);
    }
  }
});

module.exports = router;
client.login(process.env.BOT_ID).catch(console.error);