let express = require('express');
let Discord = require('discord.js');
let shell = require('shelljs');
const client = new Discord.Client();
const axios = require('axios');
let httpBuildQuery = require('http-build-query');
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
  client.user.setActivity("gérer le serveur", {
    type: "PLAYING",
    url: process.env.BOT_URL
  }).catch(console.error);
  client.channels.cache.get(process.env.CHANNEL_ADMIN_ID).send("Je suis en ligne. Je viens d'être (re)démarré. Cela signifie qu'il y a soit eu un bug, soit que j'ai été mis à jour, soit qu'on m'a redémarré manuellement. La gestion des amphis a été remise à zéro (je gère plus ceux déjà créés).");
});

client.on("guildMemberAdd", (member) => {
  member.send("Bienvenue sur le serveur Discord des étudiants de l'UTT." +
      "\nCeci n'étant pas une zone de non droit, vous devez vous identifier en cliquant ici (que vous soyez étudiant ou prof) : "+process.env.BOT_URL+
      "\nVous devez également lire les règles dans le channel `accueil`"+"\n\nEn cas de problème, contactez l'un des administrateurs, visibles en haut à droite.").catch(console.error)
});

client.on('message', msg => {
  if (msg.content.startsWith(process.env.BOT_PREFIX) && msg.channel.id === process.env.CHANNEL_ADMIN_ID) {
    let parametres = msg.content.split(" ");
    if(parametres.length > 1)
      if (parametres[1] === "addUE") {
        if(parametres.length !== 4 || !msg.mentions.roles.first())
        {
          msg.reply(" :warning:  Erreur. La syntaxe est `"+process.env.BOT_PREFIX+" addUE @RoleUE <categoryID>`. La catégorie et le rôle doivent déjà exister.").catch(console.error);
        }
        else
        {
          client.guilds.cache.get(process.env.SERVER_ID).channels.create(msg.mentions.roles.first().name.toLowerCase(), {parent: parametres[3], permissionOverwrites:[
              {
                id: msg.guild.roles.everyone,
                deny: 2147483127
              },
              {
                id: msg.mentions.roles.first().id,
                allow: 36961344
              }
            ]}).catch(console.error);
          client.guilds.cache.get(process.env.SERVER_ID).channels.create(msg.mentions.roles.first().name.toLowerCase()+" - vocal", {parent: parametres[3], type: "voice", permissionOverwrites:[
              {
                id: msg.guild.roles.everyone,
                deny: 2147483127
              },
              {
                id: msg.mentions.roles.first().id,
                allow: 36961344
              }
            ]}).catch(console.error);
          msg.channel.send(":white_check_mark: Si la catégorie existe, c'est fait !").catch(console.error);
        }
      }
    else if(parametres[1] === "delUE")
    {
      if(parametres.length !== 3 || !msg.mentions.channels.first())
      {
        msg.reply(" :warning: Erreur. La syntaxe est `"+process.env.BOT_PREFIX+" delUE #ueASupprimer`. Vous devez tagguer le channel texte de l'UE !").catch(console.error);
      }
      else
      {
        client.guilds.cache.get(process.env.SERVER_ID).channels.cache.find(channel => (channel.name.toLowerCase().includes(" "+msg.mentions.channels.first().name.toLowerCase()) || channel.name.toLowerCase().includes(msg.mentions.channels.first().name.toLowerCase()+" ")) && channel.type === "voice").delete("Demandé par "+msg.author.tag+" "+msg.author.username).catch(console.error);
        msg.mentions.channels.first().delete("Demandé par "+msg.author.tag+" "+msg.author.username).catch(console.error);
        client.guilds.cache.get(process.env.SERVER_ID).roles.cache.find(role => role.name.toUpperCase() === msg.mentions.channels.first().name.toUpperCase()).delete("Demandé par "+msg.author.tag+" "+msg.author.username).catch(console.error);
        msg.channel.send(":white_check_mark: Les deux channels texte et voix ainsi que le rôle ont été effacés pour "+msg.mentions.channels.first().name+" !").catch(console.error);
      }
    }
    else if (parametres[1] === "getNb") {
        if (parametres.length !== 3 || !msg.mentions.roles.first()) {
          msg.reply(" :warning:  Erreur. La syntaxe est `" + process.env.BOT_PREFIX + " getNb @RoleUE`. Le rôle doit exister.").catch(console.error);
        } else {
          msg.channel.send(":white_check_mark: Il y a "+msg.mentions.roles.first().members.size+" utilisateur(s) dans le rôle "+msg.mentions.roles.first().name).catch(console.error);
        }
      }
    else if (parametres[1] === "getRoles") {
        if (parametres.length !== 3) {
          msg.reply(" :warning:  Erreur. La syntaxe est `" + process.env.BOT_PREFIX + " getRoles NombreDePersonnes`.").catch(console.error);
        } else {
          msg.channel.send(":clock1: Cette commande peut être longue, elle affichera un message pour signaler sa fin. Si elle ne le fait pas, contacter un administrateur.").then(function (message) {
            let compteur = 0;
            msg.guild.roles.cache.forEach(role => {
              if(role.members.size.toString() === parametres[2].toString()) {
                msg.channel.send("Le rôle "+role.name+" a "+ role.members.size + " utilisateur(s).").catch(console.error);
                compteur = compteur + 1;
              }
            });
            msg.channel.send(":white_check_mark: Commande terminée, "+compteur+" roles ont été identifiés.").catch(console.error);
          }).catch(console.error);
        }
      }
    else if (parametres[1] === "getZeroOne") {
        msg.channel.send(":clock1: Cette commande peut être longue, elle affichera un message pour signaler sa fin. Si elle ne le fait pas, contacter un administrateur.").then(function (message) {
          let compteur = 0;
          msg.guild.roles.cache.forEach(role => {
            if(role.members.size === 0 || role.members.size === 1) {
              msg.channel.send("Le rôle "+role.name+" a "+ role.members.size + " utilisateur.").catch(console.error);
              compteur = compteur + 1;
            }
          });
          msg.channel.send(":white_check_mark: Commande terminée, "+compteur+" roles ont été identifiés.").catch(console.error);
        }).catch(console.error);
      }
    else if (parametres[1] === "author") {
      msg.channel.send("Le créateur de ce bot est Ivann LARUELLE, ivann.laruelle@gmail.com\nLe créateur du système d'export est ici : https://github.com/Tyrrrz").catch(console.error);
      }
    else if (parametres[1] === "getUrl") {
        msg.channel.send("URL de connexion (à transmettre) : "+process.env.BOT_URL+"\n\nLe lien d'invitation direct (peu recommandé) : "+process.env.LIEN_INVITATION_DISCORD).catch(console.error);
      }
    else if (parametres[1] !== "export")
    {
      parametres[1] = "help";
    }
    if(parametres.length === 1 || parametres[1] === "help")
    {
      msg.channel.send(":tools: Plusieurs fonctions accessibles. Contacter Ivann LARUELLE, ivann.laruelle@gmail.com en cas de problème"+
      "\n\n`"+process.env.BOT_PREFIX+" addUE @RoleUE <categoryID>`. Permet de créer les channels texte et voix d'un rôle existant avec les permissions correctes. La catégorie et le rôle doivent déjà exister."+
          "\n`"+process.env.BOT_PREFIX+" delUE #ueASupprimer`. Supprime les channels texte et voix de l'UE et le rôle. Vous devez tagguer le channel texte de l'UE !"+
          "\n`"+process.env.BOT_PREFIX+" getNb @ROLE`. Récupère le nombre de personnes dans le rôle. Le rôle doit exister."+
          "\n`"+process.env.BOT_PREFIX+" getRoles NombrePersonne`. Affiche la liste des rôles ne contenant que le nombre de personnes demandé. :clock1: Cette commande peut être longue."+
          "\n`"+process.env.BOT_PREFIX+" getZeroOne`. Affiche les rôles ayant soit 0 ou 1 personne dedans. :clock1: Cette commande peut être longue."+
          "\n`"+process.env.BOT_PREFIX+" getUrl`. Affiche les url du serveur web du bot, le lien d'invitation discord"+
          "\n`"+process.env.BOT_PREFIX+" export`. Exporte tout le channel (maximum 600 messages) dans laquelle la commande est tapée, dans un html lisible offline. Tout ceux ayant un rôle >= Enseignant peuvent taper cette commande n'importe où." +
          "").catch(console.error);
    }
  }
  if (msg.content.startsWith(process.env.BOT_PREFIX))
  {
    let parametres = msg.content.split(" ");
    if(parametres.length === 2 && parametres[1] === "export")
    {
      if(msg.member.roles.highest.comparePositionTo(process.env.ROLE_ENSEIGNANT_ID) >= 0)
      {
        function remove_non_ascii(str) {

          if ((str===null) || (str===''))
            return false;
          else
            str = str.toString();

          return str.replace(/[^\x20-\x7E]/g, '');
        }
        let nomChannel = remove_non_ascii(msg.channel.name);
        msg.channel.send("Lancement de l'export pour maximum 600 messages. Cette commande peut prendre un certain temps (2 minutes max, notifier un administrateur en cas de délai plus long !)").then(function (message) {
          shell.exec("dotnet "+process.env.DISCORD_CHAT_EXPORTER_EXE_PATH + " export -t "+process.env.BOT_TOKEN+" -b -c "+msg.channel.id+" -f HtmlDark -o "+process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+".html 2>&1");
          shell.exec("wget --mirror --restrict-file-names=windows --page-requisites --adjust-extension --convert-links --execute robots=off --span-hosts -Dlocalhost,cdn.discordapp.com,cdnjs.cloudflare.com -P " +process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+" --user-agent mozilla http://localhost:8000/"+nomChannel+".html 2>&1 | grep -i 'failed\\|error'");
          shell.exec("touch "+process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+"/Ouvrez_le_dossier_localhost_et_ouvrez_le_fichier_html_dans_navigateur_web");
          shell.exec("cd "+process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+" && zip -q -r "+nomChannel+".zip *");
          msg.channel.send("Voici l'export. Vous devez extraire les fichiers du fichier zip, et ensuite ouvrir le fichier html du dossier localhost. La personne à l'origine de la commande l'a également reçu en message privé.").catch(console.error);
          msg.channel.send(new Discord.MessageAttachment(process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+"/"+nomChannel+".zip")).catch(console.error);
          msg.author.send("Voici l'export. Vous devez extraire les fichiers du fichier zip, et ensuite ouvrir le fichier html du dossier localhost.").catch(console.error);
          msg.author.send(new Discord.MessageAttachment(process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+"/"+nomChannel+".zip")).then(function (message) {
            shell.exec("rm -rf "+process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+"*");
            //Windows : shell.exec("del "+process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+".html");
          }).catch(console.error);
        }).catch(console.error);
      }
      else
      {
        msg.reply(" :octagonal_sign: Action non autorisée ! Seul un enseignant ou une personne ayant un rôle supérieur peut lancer cette commande.").catch(console.error);
      }
    }
  }
});

let tableauAmphi = [];
client.on('voiceStateUpdate', (oldState, newState ) => {
  if(newState.channelID === process.env.CHANNEL_CREATION_AMPHI)
  {
    let nomChannel = "amphi";
    if(!newState.member.nickname)
      nomChannel = newState.member.user.username;
    else
      nomChannel = newState.member.nickname;
    client.guilds.cache.get(process.env.SERVER_ID).channels.create(nomChannel +" - vocal", {parent: process.env.CATEGORY_AMPHI, type: "voice"})
        .then(function (channel) {
          if(!(newState.member.id in tableauAmphi))
            tableauAmphi[newState.member.id] = [];
          tableauAmphi[newState.member.id].push(channel.id);
          newState.member.voice.setChannel(channel.id).catch(console.error);
        })
        .catch(console.error);
    client.guilds.cache.get(process.env.SERVER_ID).channels.create(nomChannel, {parent: process.env.CATEGORY_AMPHI})
        .then(function (channel) {
          if(!(newState.member.id in tableauAmphi))
            tableauAmphi[newState.member.id] = [];
          tableauAmphi[newState.member.id].push(channel.id);
          client.channels.cache.get(channel.id).send(":speaking_head: <@"+newState.member.id+"> Votre amphi vient d'être créé. Vous disposez d'un canal textuel (celui que vous regardez, visible à gauche et qui commence par #), et d'un canal vocal où vous pouvez parler jusqu'à 100 personnes, et 50 maximum si vous partagez votre écran."+
              "\n:wastebasket: **Les canaux voix et texte seront effacés dès que vous quitterez le vocal.**"+
              "\n\n:loudspeaker: Dites à vos étudiants que vous êtes là en tapant dans ce canal `@ NOM_UE` (en majuscule, sans espace entre @ et le nom de l'UE)."+
              "\n\n:writing_hand: Si vous souhaitez conserver le tchat, pensez à taper commande `/ UE export`, **sans l'espace entre / et UE**. Seul un enseignant ou un modérateur/administrateur peut utiliser cette commande qui génére un fichier zip contenant tout la conversation du tchat textuel utilisable dans un navigateur web, même hors ligne. :warning: Au delà de 600 messages (il faut y arriver !), la sauvegarde n'est pas garantie."+
              "\n\n:tools: Vous pouvez renommer vos salons sur la gauche qui portent votre nom pour leur donner le nom de l'UE par exemple (clic-droit sur le salon à gauche, modifier le salon puis enregistrer les changements)"+
              "\n\n:toolbox: En bas à gauche, à côté de voix connectée, vous disposez de 5 boutons."+
              "\nLes deux boutons au dessus permettent de diffuser votre écran (bouton flèche dans l'écran) ou de mettre fin à la communication (bouton téléphone avec la croix)."+
              "\nLes trois boutons du bas permettent de couper votre micro (ne plus parler), ou votre casque (ne plus entendre), et d'accéder aux paramètres du logiciels grâce à la roue crantée."+
              "\n\n:grey_question: N'hésitez pas à envoyer un message à la modération (tapez `@ Modération` sans espace) ou l'administration (`@ Administrateur`, sans espace) du serveur en cas de souci."+
              "\n\n:school: Bon cours !\n\n").then(function (message) {
                message.pin().catch(console.error);
              });
        }).catch(console.error);
  }
  if(oldState.channelID && oldState.channelID !== newState.channelID && oldState.channelID !== process.env.CHANNEL_CREATION_AMPHI && oldState.member.id in tableauAmphi && tableauAmphi[oldState.member.id].includes(oldState.channelID)) {
    if(oldState.channel.members.keyArray().length > 0)
    {
      if(!(oldState.channel.members.first().id in tableauAmphi))
        tableauAmphi[oldState.channel.members.first().id] = [];
      tableauAmphi[oldState.channel.members.first().id] = tableauAmphi[oldState.member.id].slice();
      delete tableauAmphi[oldState.member.id];
    }
    else
    {
      tableauAmphi[oldState.member.id].forEach(id => client.guilds.cache.get(process.env.SERVER_ID).channels.cache.get(id).delete("fin d'amphi").catch(console.error));
      delete tableauAmphi[oldState.member.id];
    }
  }
});

module.exports = router;
client.login(process.env.BOT_TOKEN).catch(console.error);