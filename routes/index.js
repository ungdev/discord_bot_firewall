let express = require('express');
let Discord = require('discord.js');
let shell = require('shelljs');
const client = new Discord.Client();
const axios = require('axios');
let httpBuildQuery = require('http-build-query');
let router = express.Router();
let baseUrl = 'https://etu.utt.fr';

/**
 * Capitalise une chaine de caractères
 * @param s
 * @returns {string}
 */
const capitalize = s => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

/** Un tableau[channelTexte] = channelVocal associé */
/** Utilisé pour vérifier si channel voix existe déjà pour un chan texte */
let tableauChannelTexteAChannelVocal = [];

/** Structure : tableauChannelsVocauxEnCours[member.id] = listedesChannelsIDGenDyn */
/** Utilisé pour supprimer les chan qui ont été générés dynamiquement */
let tableauChannelsVocauxEnCours = [];

function remove_non_ascii(str) {
  if (str === null || str === '') return false;
  else str = str.toString();

  return str.replace(/[^\x20-\x7E]/g, '');
}

/** Ci après des liste de permissions utilisées lors de la création de channels */
/** https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS */
let toutesPermissions = new Discord.Permissions([
  'CREATE_INSTANT_INVITE',
  'KICK_MEMBERS',
  'BAN_MEMBERS',
  'MANAGE_CHANNELS',
  'MANAGE_GUILD',
  'ADD_REACTIONS',
  'VIEW_AUDIT_LOG',
  'PRIORITY_SPEAKER',
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'SEND_TTS_MESSAGES',
  'MANAGE_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES',
  'READ_MESSAGE_HISTORY',
  'MENTION_EVERYONE',
  'USE_EXTERNAL_EMOJIS',
  'CONNECT',
  'SPEAK',
  'MUTE_MEMBERS',
  'DEAFEN_MEMBERS',
  'MOVE_MEMBERS',
  'USE_VAD',
  'CHANGE_NICKNAME',
  'MANAGE_NICKNAMES',
  'MANAGE_ROLES',
  'MANAGE_WEBHOOKS',
  'MANAGE_EMOJIS'
]);

let permissionsLireEcrireBasiques = new Discord.Permissions([
  'ADD_REACTIONS',
  'STREAM',
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'SEND_TTS_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES',
  'READ_MESSAGE_HISTORY',
  'MENTION_EVERYONE',
  'CONNECT',
  'SPEAK',
  'USE_VAD'
]);

let permissionsLireEcrireProf = new Discord.Permissions([
  'ADD_REACTIONS',
  'PRIORITY_SPEAKER',
  'STREAM',
  'VIEW_CHANNEL',
  'SEND_MESSAGES',
  'SEND_TTS_MESSAGES',
  'MANAGE_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES',
  'READ_MESSAGE_HISTORY',
  'MENTION_EVERYONE',
  'CONNECT',
  'SPEAK',
  'USE_VAD',
  'MANAGE_ROLES'
]);

/** Merci StackOverflow */
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

async function help(channelID) {
  let channel = await client.channels.fetch(channelID);
  channel
    .send(
      ':tools: Plusieurs fonctions accessibles. Contacter Ivann LARUELLE, ivann.laruelle@gmail.com, créateur de ce bot, en cas de problème'
    )
    .catch(console.error);
  if (channelID === process.env.CHANNEL_ADMIN_ID) {
    channel
      .send(
        '\n\n`' +
          process.env.BOT_PREFIX +
          " addUE @RoleUE <categoryID> texte | vocal | lesDeux`. Permet de créer les channels texte et voix d'un rôle existant avec les permissions correctes. La catégorie et le rôle doivent déjà exister." +
          '\n`' +
          process.env.BOT_PREFIX +
          " delUE #ueASupprimer vocal | tout`. Supprime les channels texte et voix de l'UE et le rôle. Vous devez tagguer le channel texte de l'UE !" +
          '\n`' +
          process.env.BOT_PREFIX +
          ' getNb @ROLE`. Récupère le nombre de personnes dans le rôle. Le rôle doit exister.' +
          '\n`' +
          process.env.BOT_PREFIX +
          ' getRoles NombrePersonne`. Affiche la liste des rôles ne contenant que le nombre de personnes demandé. :clock1: Cette commande peut être longue.' +
          '\n`' +
          process.env.BOT_PREFIX +
          ' getZeroOne`. Affiche les rôles ayant soit 0 ou 1 personne dedans. :clock1: Cette commande peut être longue.' +
          '\n`' +
          process.env.BOT_PREFIX +
          " getUrl`. Affiche les url du serveur web du bot, le lien d'invitation discord" +
          '\n`' +
          process.env.BOT_PREFIX +
          ' listDynVoc`. Affiche tous les channels textes dans lesquels des vocaux ont été lancés, ainsi que leur catégorie. Utile pour savoir quand lancer une mise à jour du bot.' +
          '\n`' +
          process.env.BOT_PREFIX +
          ' kickAll`. Expulse tous les membres du serveur. Commande réservée aux administrateurs. Expulse toute personne qui tape la commande sans être admin.\n\n'
      )
      .catch(console.error);
  }
  channel
    .send(
      '\n`' +
        process.env.BOT_PREFIX +
        " export`. Exporte tout le channel (maximum 600 messages) dans laquelle la commande est tapée, dans un html lisible offline. **Seuls ceux ayant un rôle >= Enseignant** peuvent taper cette commande n'importe où." +
        '\n`' +
        process.env.BOT_PREFIX +
        " joinVocal`. Pour les étudiants, crée ou rejoint le channel vocal de l'UE correspondant au channel texte, auquel seuls les étudiants de l'UE ont accès. Pour les enseignants, crée un amphi vocal et textuel que tout le monde peut rejoindre. Si vous rajoutez `@NOM_UE` à la fin de la commande, crée un amphi visible seulement par vous, les étudiants de l'UE et les personnes de votre choix." +
        '\n`' +
        process.env.BOT_PREFIX +
        " pin messageID`. Permet d'ajouter un message à la liste des messages pin (sans donner la permission `MANAGE_MESSAGES`)" +
        '\n`' +
        process.env.BOT_PREFIX +
        ' unpin messageID`. Permet de supprimer un message de la liste des messages pin (sans donner la permission `MANAGE_MESSAGES`)' +
        '\n\n`' +
        process.env.BOT_PREFIX +
        " author` Affiche des informations diverses sur l'auteur de ce bot"
    )
    .catch(console.error);
}

function author() {
  return (
    'Le créateur de ce bot est Ivann LARUELLE, ivann.laruelle@gmail.com' +
    "\nJ'aime l'OpenSource : https://github.com/ungdev/discord_bot_firewall / https://hub.docker.com/repository/docker/ungdev/discord_bot_firewall" +
    "\n\n:sos: Si vous aussi vous voulez faire un bot sur Discord, ne faites pas la même erreur que moi, **oubliez NodeJS**. Quelle idée quand j'y repense ... Si j'avais su plutôt que la librairie discord.py existait..." +
    "\n\n\nLe créateur du système d'export est ici : https://github.com/Tyrrrz"
  );
}

/* GET home page. */
router.get('/', function(req, res) {
  /** Redirige tout de suite l'utilisateur vers le site etu pour authentification. La route de retour est /connexion */
  let donnees = {
    client_id: process.env.SITE_ETU_CLIENT_ID,
    response_type: 'code',
    state: 'xyz'
  };
  res.redirect(baseUrl + '/api/oauth/authorize?' + httpBuildQuery(donnees));
});

/* GET home page. */
router.get('/status', function(req, res) {
  res.send('Application up and running !');
});

let texteBug =
  "Nous n'avons pas pu vous authentifier. Cela peut être du à bug momentané. <a href='/'>Revenir au départ et recommencer !</a>";

router.get('/connexion', function(req, res) {
  /** S'il y a bien un token dans la requete, on continue */
  if (req.query.code) {
    /** On vérifie le token en demandant un auth_code permanent au site etu */
    let donnees = {
      grant_type: 'authorization_code',
      scopes: 'public',
      code: req.query.code,
      client_id: process.env.SITE_ETU_CLIENT_ID,
      client_secret: process.env.SITE_ETU_CLIENT_SECRET
    };
    let access_token = '';
    axios
      .post(baseUrl + '/api/oauth/token?' + httpBuildQuery(donnees))
      .then(function(response) {
        access_token = response.data.access_token.toString();
        /** Si autorisation ok, on affiche le formulaire de saisie de l'identifiant discord */
        if (access_token !== '') {
          res.render('formulaire', {
            token: access_token,
            lienDiscord: process.env.LIEN_INVITATION_DISCORD
          });
        } else res.send("Nous n'avons pas pu vous authentifier. <a href='/'>Revenir au départ</a>");
        /** Message d'erreur sinon invitant l'utilisateur à recommencer */
      })
      .catch(function() {
        res.send(texteBug);
      });
  }
});

/** Quand l'utilisateur soumet son formulaire, il arrive ici */
router.get('/attribuerrole', function(req, res) {
  /** On vérifie qu'on a toutes les infos du formulaire */
  if (
    req.query.site_etu_token &&
    req.query.utilisateur &&
    req.query.discriminant
  ) {
    if (req.query.checkRGPD !== 'on')
      res.send(
        "Vous n'avez pas coché la case de consentement RGPD. Vos données n'ont pas été traitées. <a href='/'>Revenir au départ et recommencer !</a>"
      );
    else {
      let donnees = {
        access_token: req.query.site_etu_token
      };
      /** On récupère les données de l'utilisateur sur le site etu */
      axios
        .get(baseUrl + '/api/public/user/account?' + httpBuildQuery(donnees))
        .then(async function(response) {
          /** L'utilisateur du site etu dans membreSiteEtu */
          let membreSiteEtu = response.data.data;
          /** Si on arrive à savoir si l'user est étu ou pas */
          if (typeof membreSiteEtu.isStudent !== 'undefined') {
            let guild = client.guilds.cache.get(process.env.SERVER_ID);
            /** On récupère son compte discord dans le serveur */
            let membreDiscord = (await guild.members.fetch()).find(
              user =>
                user.user.username === req.query.utilisateur &&
                user.user.discriminator === req.query.discriminant
            );
            /** Si on l"a trouvé */
            if (membreDiscord) {
              let roles = (await guild.roles.fetch()).cache;
              /** Liste des id de rôles à attribuer */
              let rolesAAttribuer = [];
              /** On définit son pseudo */
              let pseudo =
                capitalize(membreSiteEtu.firstName.toString()) +
                ' ' +
                membreSiteEtu.lastName.toString().toUpperCase();
              if (membreSiteEtu.isStudent) {
                /** On ajoute le rôle étudiant */
                rolesAAttribuer.push(process.env.ROLE_ETUDIANT_ID);
                /** On définit un pseudo */
                pseudo += ' - ' + membreSiteEtu.branch + membreSiteEtu.level;
                /** On définit la liste des noms de rôles à attribuer (nom uvs + nom de branche) */
                let tableauChainesToRoles = membreSiteEtu.uvs;
                tableauChainesToRoles.push(membreSiteEtu.branch);

                /** Pour tous les noms de rôle on récupère l'id du rôle et on l'ajoute à la liste des id de rôles à attribuer */
                for (let chaine of tableauChainesToRoles) {
                  if (chaine === '') chaine = 'vide';
                  let role = roles.find(
                    role =>
                      role.name.toUpperCase() ===
                      chaine.toString().toUpperCase()
                  );
                  if (role) rolesAAttribuer.push(role.id);
                  else {
                    /** Si le rôle n'existe pas, on le crée et on alerte sur le chan texte dédié au bot. */
                    client.channels.cache
                      .get(process.env.CHANNEL_ADMIN_ID)
                      .send(
                        'Le rôle ' +
                          chaine +
                          " va être créé pour l'utilisateur " +
                          membreDiscord.user.tag +
                          ' ' +
                          pseudo
                      );
                    let roleCree = await guild.roles
                      .create({
                        data: { name: chaine.toString().toUpperCase() }
                      })
                      .catch(console.error);
                    rolesAAttribuer.push(roleCree.id);
                  }
                }
              } else rolesAAttribuer.push(process.env.ROLE_ENSEIGNANT_ID);
              /** Si pas étudiant, le seul rôle est le rôle prof */
              /** On applique le pseudo sur le compte */
              if (pseudo.length > 32) {
                client.channels.cache
                  .get(process.env.CHANNEL_ADMIN_ID)
                  .send(
                    ' :warning: Le pseudo ' +
                      pseudo +
                      " de l'utilisateur " +
                      membreDiscord.user.tag +
                      ' est trop long. Vérifiez son pseudo.'
                  );
                pseudo = pseudo.slice(0, 32);
              }
              membreDiscord.setNickname(pseudo).catch(console.error);
              /** On applique les rôles */
              membreDiscord.roles.set(rolesAAttribuer).catch(console.error);
              /** On affiche un message */
              res.send(
                "Vos rôles ont été affectés. Si d'ici quelques heures rien ne change dans votre compte, merci de nous contacter.<br><br><b>Vous pouvez maintenant fermer cette fenêtre et retourner sur Discord.</b>"
              );
            } else
            /** SI utilisateur non trouvé dans le serveur, message */
              res.send(
                "Utilisateur discord non trouvé dans le serveur. Avez-vous bien rejoint le serveur Discord ? <a href='/'>Revenir au départ</a>"
              );
          } else res.send(texteBug);
          /** Si le token n'a pas pu être validé (tentative de hacking, ...), affiche un message */
        })
        .catch(function() {
          res.send(texteBug);
        });
    }
  } else {
  /** Si tous les champs n'ont pas pu être trouvés, affiche un message */
    res.send("Le formulaire est incomplet. <a href='/'>Revenir au départ</a>");
  }
});

/** Quand le bot se lance */
client.on('ready', async () => {
  /** On dit qu'il est en train de jouer à "gérer le serveur" sur l'url du BOT */
  client.user
    .setActivity('gérer le serveur', {
      type: 'PLAYING',
      url: process.env.BOT_URL
    })
    .catch(console.error);
  /** On alerte sur le chan dédié au bot du démarrage */
  (await client.channels.fetch(process.env.CHANNEL_ADMIN_ID)).send(
    "Je suis en ligne. Je viens d'être (re)démarré. Cela signifie qu'il y a soit eu un bug, soit que j'ai été mis à jour, soit qu'on m'a redémarré manuellement. La gestion des vocaux a été remise à zéro (je ne gère plus ceux déjà créés)."
  );
});

/**
 * Quand un utilisateur rejoint le serveur, on lui envoie un message de bienvenue pour lui dire de se connecter au site etu
 */
client.on('guildMemberAdd', member => {
  member
    .send(
      "Bienvenue sur le serveur Discord des étudiants de l'UTT." +
        "\nCeci n'étant pas une zone de non droit, vous **devez** vous identifier en cliquant ici (**que vous soyez étudiant ou prof**) : " +
        process.env.BOT_URL +
        '\nVous devez également lire les règles dans le channel `accueil`' +
        "\n\nEn cas de problème, contactez l'un des administrateurs, visibles en haut à droite.+\nTapez `/UE` dans un channel texte pour voir la liste des commandes."
    )
    .catch(console.error);
});

/** Si le bot reçoit un message en privé, ou sur l'un des channels qu'ils peut voir */
client.on('message', async msg => {
  /** Si le message a le bon préfixe et est dans le channel dédié au bot, accès étendu aux commandes */
  if (
    msg.content.toLowerCase().startsWith(process.env.BOT_PREFIX.toLowerCase())
  ) {
    /** On découpe la ligne de commande par les espaces */
    /** index 0 : le préfix, index 1 : la commande, index 2,3,... : les vrais paramètres */
    let parametres = msg.content.split(' ');
    if (parametres.length === 1) parametres[1] = 'help';
    if (msg.channel.id === process.env.CHANNEL_ADMIN_ID) {
      /** Série de if,elseifs, else avec les commandes possibles */
      /** Créer les salons d'une UE dans une catégorie, l'UE ayant déjà un rôle */
      if (parametres[1].toLowerCase() === 'addue') {
        /** S'il n'y a pas 3 paramètres dont la mention d'un role ni de ce qui doit être créé */
        if (
          parametres.length !== 5 ||
          !msg.mentions.roles.first() ||
          !['texte', 'vocal', 'lesdeux'].includes(parametres[4].toLowerCase())
        ) {
          msg
            .reply(
              ' :warning:  Erreur. La syntaxe est `' +
                process.env.BOT_PREFIX +
                ' addUE @RoleUE <categoryID> texte | vocal | lesDeux`. La catégorie et le rôle doivent déjà exister.'
            )
            .catch(console.error);
        } else {
        /** Si tout va bien */
          /** On crée le texte avec aucune permission pour @everyone et les permissions d'écrire pour le rôle concerné */
          if (
            parametres[4].toLowerCase() === 'texte' ||
            parametres[4].toLowerCase() === 'lesdeux'
          ) {
            client.guilds.cache
              .get(process.env.SERVER_ID)
              .channels.create(msg.mentions.roles.first().name.toLowerCase(), {
                parent: parametres[3],
                permissionOverwrites: [
                  {
                    id: msg.guild.roles.everyone,
                    deny: toutesPermissions
                  },
                  {
                    id: msg.mentions.roles.first().id,
                    allow: permissionsLireEcrireBasiques
                  }
                ]
              })
              .then(function(channel) {
                channel.send(
                  'Bonjour <@&' +
                    msg.mentions.roles.first().id +
                    ">, votre channel texte vient d'être créé !"
                );
              })
              .catch(console.error);
          }
          /** On crée le vocal avec aucune permission pour @everyone et les permissions de parler/connecter pour le rôle concerné */
          if (
            parametres[4].toLowerCase() === 'vocal' ||
            parametres[4].toLowerCase() === 'lesdeux'
          ) {
            client.guilds.cache
              .get(process.env.SERVER_ID)
              .channels.create(
                msg.mentions.roles.first().name.toLowerCase() + ' - vocal',
                {
                  parent: parametres[3],
                  type: 'voice',
                  permissionOverwrites: [
                    {
                      id: msg.guild.roles.everyone,
                      deny: toutesPermissions
                    },
                    {
                      id: msg.mentions.roles.first().id,
                      allow: permissionsLireEcrireBasiques
                    }
                  ]
                }
              )
              .catch(console.error);
          }
          msg.channel
            .send(":white_check_mark: Si la catégorie existe, c'est fait !")
            .catch(console.error);
        }
      } else if (parametres[1].toLowerCase() === 'delue') {
      /** Suppression d'une UE en indiquant son channel texte */
        if (
          parametres.length !== 4 ||
          !msg.mentions.channels.first() ||
          !['tout'.toLowerCase(), 'vocal'.toLowerCase()].includes(
            parametres[3].toLowerCase()
          )
        ) {
          msg
            .reply(
              ' :warning: Erreur. La syntaxe est `' +
                process.env.BOT_PREFIX +
                " delUE #ueASupprimer vocal | tout`. Vous devez tagguer le channel texte de l'UE !"
            )
            .catch(console.error);
        } else {
          if (
            parametres[3].toLowerCase() === 'tout' ||
            parametres[3].toLowerCase() === 'vocal'
          )
            client.channels.cache
              .find(
                channel =>
                  (channel.name
                    .toLowerCase()
                    .includes(
                      ' ' + msg.mentions.channels.first().name.toLowerCase()
                    ) ||
                    channel.name
                      .toLowerCase()
                      .includes(
                        msg.mentions.channels.first().name.toLowerCase() + ' '
                      )) &&
                  channel.type === 'voice'
              )
              .delete(
                'Demandé par ' + msg.author.tag + ' ' + msg.author.username
              )
              .catch(console.error);
          if (parametres[3].toLowerCase() === 'tout') {
            msg.mentions.channels
              .first()
              .delete(
                'Demandé par ' + msg.author.tag + ' ' + msg.author.username
              )
              .catch(console.error);
            (
              await client.guilds.cache.get(process.env.SERVER_ID).roles.fetch()
            ).cache
              .find(
                role =>
                  role.name.toUpperCase() ===
                  msg.mentions.channels.first().name.toUpperCase()
              )
              .delete(
                'Demandé par ' + msg.author.tag + ' ' + msg.author.username
              )
              .catch(console.error);
          }
          msg.channel
            .send(
              ':white_check_mark: Ce que vous avez demandé a été effacé pour ' +
                msg.mentions.channels.first().name +
                ' !'
            )
            .catch(console.error);
        }
      } else if (parametres[1].toLowerCase() === 'getnb') {
        if (parametres.length !== 3 || !msg.mentions.roles.first()) {
          msg
            .reply(
              ' :warning:  Erreur. La syntaxe est `' +
                process.env.BOT_PREFIX +
                ' getNb @RoleUE`. Le rôle doit exister.'
            )
            .catch(console.error);
        } else {
          msg.channel
            .send(
              ':white_check_mark: Il y a ' +
                msg.mentions.roles.first().members.size +
                ' utilisateur(s) dans le rôle ' +
                msg.mentions.roles.first().name
            )
            .catch(console.error);
        }
      } else if (parametres[1].toLowerCase() === 'getroles') {
        if (parametres.length !== 3) {
          msg
            .reply(
              ' :warning:  Erreur. La syntaxe est `' +
                process.env.BOT_PREFIX +
                ' getRoles NombreDePersonnes`.'
            )
            .catch(console.error);
        } else {
          msg.channel
            .send(
              ':clock1: Cette commande peut être longue, elle affichera un message pour signaler sa fin. Si elle ne le fait pas, contacter un administrateur.'
            )
            .then(async function() {
              let compteur = 0;
              (await msg.guild.roles.fetch()).cache.forEach(role => {
                if (role.members.size.toString() === parametres[2].toString()) {
                  msg.channel
                    .send(
                      'Le rôle ' +
                        role.name +
                        ' a ' +
                        role.members.size +
                        ' utilisateur(s).'
                    )
                    .catch(console.error);
                  compteur = compteur + 1;
                }
              });
              msg.channel
                .send(
                  ':white_check_mark: Commande terminée, ' +
                    compteur +
                    ' roles ont été identifiés.'
                )
                .catch(console.error);
            })
            .catch(console.error);
        }
      } else if (parametres[1].toLowerCase() === 'getzeroone') {
        msg.channel
          .send(
            ':clock1: Cette commande peut être longue, elle affichera un message pour signaler sa fin. Si elle ne le fait pas, contacter un administrateur.'
          )
          .then(async function() {
            let compteur = 0;
            (await msg.guild.roles.fetch()).cache.forEach(role => {
              if (role.members.size === 0 || role.members.size === 1) {
                msg.channel
                  .send(
                    'Le rôle ' +
                      role.name +
                      ' a ' +
                      role.members.size +
                      ' utilisateur.'
                  )
                  .catch(console.error);
                compteur = compteur + 1;
              }
            });
            msg.channel
              .send(
                ':white_check_mark: Commande terminée, ' +
                  compteur +
                  ' roles ont été identifiés.'
              )
              .catch(console.error);
          })
          .catch(console.error);
      } else if (parametres[1].toLowerCase() === 'geturl') {
        msg.channel
          .send(
            'URL de connexion (à transmettre) : ' +
              process.env.BOT_URL +
              "\n\nLe lien d'invitation direct (peu recommandé) : " +
              process.env.LIEN_INVITATION_DISCORD
          )
          .catch(console.error);
      } else if (parametres[1].toLowerCase() === 'kickall') {
        if ((await msg.member.fetch()).hasPermission('ADMINISTRATOR')) {
          if (parametres.length < 3)
            msg
              .reply(
                "@everyone :warning: Cette commande est destructrice. Elle expulsera toute les personnes / bot / ... ayant un rôle inférieur au bot, ou n'étant pas admin. Tapez `" +
                  process.env.BOT_PREFIX +
                  ' kickall SERVER_ID` pour confirmer.\n\n@everyone Surveillez !'
              )
              .catch(console.error);
          else {
            if (parametres[2] === msg.guild.id) {
              msg
                .reply(
                  "@everyone Lancement de l'expulsion. :clock1: Cette commande peut être longue, le bot enverra un message quand ça sera fini."
                )
                .catch(console.error);
              await msg.channel.send(
                'Il y a ' + (await msg.guild.fetch()).memberCount + ' membres'
              );
              let compteur = 0;
              (
                await client.guilds.cache
                  .get(process.env.SERVER_ID)
                  .members.fetch()
              ).forEach(function(membre) {
                if (!membre.hasPermission('ADMINISTRATOR')) {
                  membre.kick('commande kickall').catch(console.error);
                  compteur = compteur + 1;
                } else msg.channel.send("L'utilisateur " + membre.user.tag + " n'a pas pu être expulsé.").catch(console.error);
              });
              await msg
                .reply(
                  ' :white_check_mark: ' +
                    compteur +
                    ' utilisateurs ont été expulsés. Il reste ' +
                    (await msg.guild.members.fetch()).size +
                    ' membres'
                )
                .catch(console.error);
            } else msg.reply("L'ID ne correspond pas.").catch(console.error);
          }
        } else {
          msg
            .reply(
              " :octagonal_sign: Vous avez tenté d'expulser tout le monde sans être administrateur. Vous allez être expulsé."
            )
            .catch(console.error);
          msg.member
            .kick('A utilisé la commande kickall sans avoir les droits')
            .catch(console.error);
          msg.author
            .send(
              ":octagonal_sign: Vous avez tenté d'expulser tout le monde sans être administrateur. Vous avez été expulsé."
            )
            .catch(console.error);
          (await client.channels.fetch(process.env.CHANNEL_ADMIN_ID)).send(
            "@everyone L'utilisateur " +
              msg.member.nickname +
              ' / ' +
              msg.author.tag +
              ' a été expulsé.'
          );
        }
      } else if (parametres[1].toLowerCase() === 'listdynvoc') {
        msg.channel.send(':clock1: Début du listing des channels');
        let compteur = 0;
        for (const key of Object.keys(tableauChannelTexteAChannelVocal)) {
          msg.channel
            .send(
              'Pour le canal texte <#' +
                (await client.channels.fetch(key.toString())).name +
                '> dans la catégorie ' +
                (
                  await client.channels.fetch(
                    (await client.channels.fetch(key.toString())).parentID
                  )
                ).name
            )
            .catch(console.error);
          compteur = compteur + 1;
        }
        msg.channel
          .send(
            ' :white_check_mark: Il y a ' +
              compteur +
              ' channels vocaux. Vérifiez aussi la catégorie amphi !'
          )
          .catch(console.error);
      } else if (
        !['export', 'joinvocal', 'author', 'pin', 'unpin'].includes(
          parametres[1].toLowerCase()
        )
      ) {
        parametres[1] = 'help';
      }
    }
    if (msg.channel.type !== 'dm') {
      if (parametres[1].toLowerCase() === 'export') {
        if (
          (await msg.member.fetch()).roles.highest.comparePositionTo(
            process.env.ROLE_ENSEIGNANT_ID
          ) >= 0
        ) {
          let nomChannel = remove_non_ascii(msg.channel.name);
          msg.channel
            .send(
              "Lancement de l'export pour maximum 600 messages. Cette commande peut prendre un certain temps (2 minutes max, notifier un administrateur en cas de délai plus long !)"
            )
            .then(function() {
              shell.exec(
                'dotnet ' +
                  process.env.DISCORD_CHAT_EXPORTER_EXE_PATH +
                  ' export -t ' +
                  process.env.BOT_TOKEN +
                  ' -b -c ' +
                  msg.channel.id +
                  ' -f HtmlDark -o ' +
                  process.env.DISCORD_CHAT_EXPORT_PATH +
                  nomChannel +
                  '.html > /dev/null'
              );
              shell.exec(
                'wget --mirror --restrict-file-names=windows --page-requisites --adjust-extension --convert-links --execute robots=off --span-hosts -Dlocalhost,cdn.discordapp.com,cdnjs.cloudflare.com -P ' +
                  process.env.DISCORD_CHAT_EXPORT_PATH +
                  nomChannel +
                  ' --user-agent mozilla http://localhost:8000/' +
                  nomChannel +
                  ".html 2>&1 | grep -i 'failed\\|error'"
              );
              shell.exec(
                'touch ' +
                  process.env.DISCORD_CHAT_EXPORT_PATH +
                  nomChannel +
                  '/Ouvrez_le_dossier_localhost_et_ouvrez_le_fichier_html_dans_navigateur_web'
              );
              shell.exec(
                'cd ' +
                  process.env.DISCORD_CHAT_EXPORT_PATH +
                  nomChannel +
                  ' && zip -q -r ' +
                  nomChannel +
                  '.zip *'
              );
              msg.channel
                .send(
                  "Voici l'export. Vous devez extraire les fichiers du fichier zip, et ensuite ouvrir le fichier html du dossier localhost. La personne à l'origine de la commande l'a également reçu en message privé."
                )
                .catch(console.error);
              msg.channel
                .send(
                  new Discord.MessageAttachment(
                    process.env.DISCORD_CHAT_EXPORT_PATH +
                      nomChannel +
                      '/' +
                      nomChannel +
                      '.zip'
                  )
                )
                .catch(console.error);
              msg.author
                .send(
                  "Voici l'export. Vous devez extraire les fichiers du fichier zip, et ensuite ouvrir le fichier html du dossier localhost."
                )
                .catch(console.error);
              msg.author
                .send(
                  new Discord.MessageAttachment(
                    process.env.DISCORD_CHAT_EXPORT_PATH +
                      nomChannel +
                      '/' +
                      nomChannel +
                      '.zip'
                  )
                )
                .then(function() {
                  shell.exec(
                    'rm -rf ' +
                      process.env.DISCORD_CHAT_EXPORT_PATH +
                      nomChannel +
                      '*'
                  );
                  //Windows : shell.exec("del "+process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+".html");
                })
                .catch(console.error);
            })
            .catch(console.error);
        } else {
          msg
            .reply(
              ' :octagonal_sign: Action non autorisée ! Seul un enseignant ou une personne ayant un rôle supérieur peut lancer cette commande.'
            )
            .catch(console.error);
        }
      } else if (parametres[1].toLowerCase() === 'author') {
        msg.channel.send(author()).catch(console.error);
      } else if (parametres[1].toLowerCase() === 'pin') {
        if (parametres.length < 3)
          msg
            .reply(" :warning: Vous devez spécifier l'ID du message à pin.")
            .catch(console.error);
        else {
          let message = await msg.channel.messages.fetch(parametres[2]);
          if (!message)
            msg
              .reply(
                " :warning: Votre message n'a pas pu être trouvé dans ce channel. Vous devez spécifier l'ID du message."
              )
              .catch(console.error);
          else message.pin().catch(console.error);
        }
      } else if (parametres[1].toLowerCase() === 'unpin') {
        if (parametres.length < 3)
          msg
            .reply(
              " :warning: Vous devez spécifier l'ID du message à supprimer des pins."
            )
            .catch(console.error);
        else {
          let message = await (await msg.channel.messages.fetchPinned()).get(
            parametres[2]
          );
          if (!message)
            msg
              .reply(
                " :warning: Votre message n'a pas pu être trouvé dans la liste des messages pin. Vous devez spécifier l'ID du message."
              )
              .catch(console.error);
          else message.unpin().catch(console.error);
        }
      } else if (parametres[1].toLowerCase() === 'joinvocal') {
        if (!msg.member.voice.channelID)
          msg
            .reply(
              ' :warning: Erreur ! Vous devez déjà être dans un canal vocal pour exécuter cette commande !'
            )
            .catch(console.error);
        else if (!msg.channel.parentID)
          msg
            .reply(
              ' :warning: Erreur ! Vous devez taper cette commande dans un channel texte dans une catégorie.'
            )
            .catch(console.error);
        else if (msg.author.id in tableauChannelsVocauxEnCours) {
          msg
            .reply(
              ' :warning: Vous êtes déjà dans un channel voix dont vous êtes le propriétaire. Quittez le vocal dans lequel vous êtes puis relancez la commande.'
            )
            .catch(console.error);
        } else if (
          (await msg.member.fetch()).roles.cache
            .keyArray()
            .includes(process.env.ROLE_ETUDIANT_ID)
        ) {
          if (
            !client.guilds.cache
              .get(process.env.SERVER_ID)
              .roles.cache.find(
                role =>
                  role.name.toUpperCase() === msg.channel.name.toUpperCase()
              )
          ) {
            msg
              .reply(
                " :warning: Erreur ! Je n'ai pas pu trouver de role associé à votre nom de channel"
              )
              .catch(console.error);
          } else if (!(msg.channel.id in tableauChannelTexteAChannelVocal)) {
            client.guilds.cache
              .get(process.env.SERVER_ID)
              .channels.create(msg.channel.name.toLowerCase() + ' - etudes', {
                parent: msg.channel.parentID,
                type: 'voice',
                permissionOverwrites: [
                  {
                    id: msg.guild.roles.everyone,
                    deny: toutesPermissions
                  },
                  {
                    id: (
                      await client.guilds.cache
                        .get(process.env.SERVER_ID)
                        .roles.fetch()
                    ).cache.find(
                      role =>
                        role.name.toUpperCase() ===
                        msg.channel.name.toUpperCase()
                    ).id,
                    allow: permissionsLireEcrireBasiques
                  }
                ]
              })
              .then(function(channel) {
                if (!(msg.author.id in tableauChannelsVocauxEnCours))
                  tableauChannelsVocauxEnCours[msg.author.id] = [];
                tableauChannelsVocauxEnCours[msg.author.id].push(channel.id);
                msg
                  .reply(' Votre canal vocal a été créé.')
                  .catch(console.error);
                msg.member.voice.setChannel(channel.id).catch(console.error);
                tableauChannelTexteAChannelVocal[msg.channel.id] = channel.id;
              })
              .catch(console.error);
          } else
            msg.member.voice
              .setChannel(tableauChannelTexteAChannelVocal[msg.channel.id])
              .catch(console.error);
        } else if (
          (await msg.member.fetch()).roles.cache
            .keyArray()
            .includes(process.env.ROLE_ENSEIGNANT_ID)
        ) {
          let nomChannel = 'vocal';
          if (!msg.member.nickname) nomChannel = msg.member.user.username;
          else nomChannel = msg.member.nickname;
          if (msg.mentions.roles.first())
            nomChannel = msg.mentions.roles.first().name.toLowerCase();
          nomChannel = nomChannel + '-amphi';
          let Permissions;
          if (msg.mentions.roles.first()) {
            Permissions = [
              {
                id: msg.guild.roles.everyone,
                deny: toutesPermissions
              },
              {
                id: msg.mentions.roles.first().id,
                allow: permissionsLireEcrireBasiques
              },
              {
                id: msg.author.id,
                allow: permissionsLireEcrireProf
              }
            ];
          } else {
            Permissions = [
              {
                id: msg.guild.roles.everyone,
                deny: toutesPermissions
              },
              {
                id: process.env.ROLE_ENSEIGNANT_ID,
                allow: permissionsLireEcrireBasiques
              },
              {
                id: process.env.ROLE_ETUDIANT_ID,
                allow: permissionsLireEcrireBasiques
              },
              {
                id: msg.author.id,
                allow: permissionsLireEcrireProf
              }
            ];
          }
          client.guilds.cache
            .get(process.env.SERVER_ID)
            .channels.create(nomChannel + ' - vocal', {
              parent: process.env.CATEGORY_AMPHI,
              type: 'voice',
              permissionOverwrites: Permissions
            })
            .then(function(channel) {
              if (!(msg.member.id in tableauChannelsVocauxEnCours))
                tableauChannelsVocauxEnCours[msg.member.id] = [];
              tableauChannelsVocauxEnCours[msg.member.id].push(channel.id);
              msg.member.voice.setChannel(channel.id).catch(console.error);
            })
            .catch(console.error);
          client.guilds.cache
            .get(process.env.SERVER_ID)
            .channels.create(nomChannel, {
              parent: process.env.CATEGORY_AMPHI,
              permissionOverwrites: Permissions
            })
            .then(async function(channel) {
              if (!(msg.member.id in tableauChannelsVocauxEnCours))
                tableauChannelsVocauxEnCours[msg.member.id] = [];
              tableauChannelsVocauxEnCours[msg.member.id].push(channel.id);
              (await client.channels.fetch(channel.id))
                .send(
                  ':speaking_head: <@' +
                    msg.member.id +
                    "> Votre amphi vient d'être créé. Vous disposez d'un canal textuel (celui que vous regardez, visible à gauche et qui commence par #), et d'un canal vocal où vous pouvez parler jusqu'à 100 personnes, et 50 maximum si vous partagez votre écran." +
                    '\n:wastebasket: **Les canaux voix et texte seront effacés dès que plus personne ne sera dans le canal vocal.**' +
                    "\n\n:writing_hand: Si vous souhaitez conserver le tchat, pensez à taper la commande `/ UE export`, **sans l'espace entre / et UE**. Seul un enseignant ou un modérateur/administrateur peut utiliser cette commande qui génére un fichier zip contenant tout la conversation du tchat textuel utilisable dans un navigateur web, même hors ligne. :warning: Au delà de 600 messages (il faut y arriver !), la sauvegarde n'est pas garantie." +
                    "\n\n:tools: Vous pouvez renommer vos salons sur la gauche qui portent votre nom pour leur donner le nom de l'UE par exemple (clic-droit sur le salon à gauche, modifier le salon puis enregistrer les changements)" +
                    '\n\n:toolbox: En bas à gauche, à côté de voix connectée, vous disposez de 5 boutons.' +
                    "\nLes deux boutons au dessus permettent de diffuser votre écran (bouton flèche dans l'écran) ou de mettre fin à la communication (bouton téléphone avec la croix)." +
                    "\nLes trois boutons du bas permettent de couper votre micro (ne plus parler), ou votre casque (ne plus entendre), et d'accéder aux paramètres de Discord grâce à la roue crantée." +
                    "\n\n:grey_question: Tapez `/UE` pour voir la liste des commandes. N'hésitez pas à envoyer un message à la modération (tapez `@ Modération` sans espace) ou l'administration (`@ Administrateur`, sans espace) du serveur en cas de souci." +
                    '\n\n:school: Bon cours !\n\n'
                )
                .then(async function(message) {
                  message.pin().catch(console.error);
                  if (msg.mentions.roles.first()) {
                    channel
                      .send(
                        ':loudspeaker: Etudiants de <@&' +
                          msg.mentions.roles.first().id +
                          '>, votre enseignant ' +
                          (msg.member.nickname
                            ? msg.member.nickname
                            : msg.author.tag) +
                          ' vient de créer un amphi !'
                      )
                      .catch(console.error);
                    let channelEtudiants = client.channels.cache.find(
                      channel =>
                        channel.type === 'text' &&
                        channel.name.toLowerCase() ===
                          msg.mentions.roles.first().name.toLowerCase()
                    );
                    if (channelEtudiants)
                      channelEtudiants.send(
                        ':school: <@&' +
                          msg.mentions.roles.first().id +
                          '> Votre enseignant ' +
                          (msg.member.nickname
                            ? msg.member.nickname
                            : msg.author.tag) +
                          ' vient de créer un amphi <#' +
                          channel.id +
                          '>'
                      );
                  }
                });
            })
            .catch(console.error);
        } else {
          msg
            .reply("Vous n'êtes ni étudiant, ni enseignant. D'où venez-vous ?")
            .catch(console.error);
          (await client.channels.fetch(process.env.CHANNEL_ADMIN_ID))
            .send(
              ' :octagonal_sign: Alerte ! ' +
                msg.author.tag +
                ' / ' +
                msg.member.nickname +
                " a tenté de lancer un vocal en n'étant ni enseignant ni étudiant."
            )
            .catch(console.error);
        }
      } else if (
        ![
          'delue',
          'addue',
          'kickall',
          'getnb',
          'getroles',
          'getzeroone',
          'geturl',
          'listdynvoc'
        ].includes(parametres[1].toLowerCase())
      ) {
        parametres[1] = 'help';
      }
    } else if (msg.channel.type === 'dm') {
      msg
        .reply(
          ' :octagonal_sign: Je ne prends aucune commande en Message Privé !'
        )
        .catch(console.error);
      msg.channel.send(author()).catch(console.error);
    }
    if (parametres[1] === 'help' && msg.channel.type !== 'dm')
      await help(msg.channel.id);
  }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
  if (
    oldState.channelID &&
    oldState.channelID !== newState.channelID &&
    oldState.channelID !== process.env.CHANNEL_CREATION_AMPHI &&
    oldState.member.id in tableauChannelsVocauxEnCours &&
    tableauChannelsVocauxEnCours[oldState.member.id].includes(
      oldState.channelID
    )
  ) {
    if (oldState.channel.members.keyArray().length > 0) {
      if (
        !(oldState.channel.members.first().id in tableauChannelsVocauxEnCours)
      )
        tableauChannelsVocauxEnCours[oldState.channel.members.first().id] = [];
      tableauChannelsVocauxEnCours[
        oldState.channel.members.first().id
      ] = tableauChannelsVocauxEnCours[oldState.member.id].slice();
      delete tableauChannelsVocauxEnCours[oldState.member.id];
    } else {
      for (const id of tableauChannelsVocauxEnCours[oldState.member.id]) {
        (await client.channels.fetch(id)).delete().catch(console.error);
      }
      delete tableauChannelsVocauxEnCours[oldState.member.id];
      if (getKeyByValue(tableauChannelTexteAChannelVocal, oldState.channelID)) {
        delete tableauChannelTexteAChannelVocal[
          getKeyByValue(tableauChannelTexteAChannelVocal, oldState.channelID)
        ];
      }
    }
  }
});

module.exports = router;

/** On connecte le BOT à discord */
client.login(process.env.BOT_TOKEN).catch(console.error);
