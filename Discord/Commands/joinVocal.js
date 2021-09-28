/* eslint no-param-reassign: ["error", { "props": false }] */

const discordUtils = require("../discordUtils");

module.exports = async function joinVocal(
  /** import("discord.js").Message */ msg,
  tableauChannelTexteAChannelVocal,
  tableauChannelsVocauxEnCours
) {
  if (!msg.member.voice.channelId)
    msg
      .reply(
        " :warning: Erreur ! Vous devez déjà être dans un canal vocal pour exécuter cette commande, sans quoi je ne pourrais vous déplacer automatiquement dans le nouveau canal vocal !"
      )
      .catch(console.error);
  else if (!msg.channel.parentId)
    msg
      .reply(
        " :warning: Erreur ! Vous devez taper cette commande dans un channel texte dans une catégorie."
      )
      .catch(console.error);
  else if (msg.author.id in tableauChannelsVocauxEnCours) {
    msg
      .reply(
        " :warning: Vous êtes déjà dans un channel voix dont vous êtes le propriétaire. Quittez le vocal dans lequel vous êtes puis relancez la commande."
      )
      .catch(console.error);
  } else if (
    [(await msg.member.fetch()).roles.cache
      .keys()]
      .includes(process.env.ROLE_ETUDIANT_ID)
  ) {
    if (
      !msg.guild.roles.cache.find(
        (role) => role.name.toUpperCase() === msg.channel.name.toUpperCase()
      )
    ) {
      msg
        .reply(
          " :warning: Erreur ! Je n'ai pas pu trouver de role associé à votre nom de channel"
        )
        .catch(console.error);
    } else if (!(msg.channel.id in tableauChannelTexteAChannelVocal)) {
      msg.guild.channels
        .create(`${msg.channel.name.toLowerCase()} - etudes`, {
          parent: msg.channel.parentId,
          type: "GUILD_VOICE",
          userLimit: 99
        })
        .then(async (channel) => {
          await channel.permissionOverwrites.edit(msg.guild.roles.everyone, discordUtils.toutesPermissionsOverwrite(false));
          await channel.permissionOverwrites.edit((await msg.guild.roles.fetch()).find(
            (role) =>
              role.name.toUpperCase() === msg.channel.name.toUpperCase()
          ).id, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
          if (!(msg.author.id in tableauChannelsVocauxEnCours))
            tableauChannelsVocauxEnCours[msg.author.id] = [];
          tableauChannelsVocauxEnCours[msg.author.id].push(channel.id);
          msg.reply(" Votre canal vocal a été créé.").catch(console.error);
          msg.member.voice.setChannel(channel.id).catch(console.error);
          tableauChannelTexteAChannelVocal[msg.channel.id] = channel.id;
        })
        .catch(console.error);
    } else
      msg.member.voice
        .setChannel(tableauChannelTexteAChannelVocal[msg.channel.id])
        .catch(console.error);
  } else if (
    [(await msg.member.fetch()).roles.cache
      .keys()]
      .includes(process.env.ROLE_ENSEIGNANT_ID) &&
    process.env.VACANCES === "1" &&
    ![(await msg.member.fetch()).roles.cache
      .keys()]
      .includes(process.env.ROLE_VACANCES_ENSEIGNANT_ID)
  ) {
    msg
      .reply(
        " :octagonal_sign: Pour la sérénité et le repos des étudiants comme des enseignants, il est interdit de lancer un amphi pendant les vacances.\nSi vous estimez que c'est nécessaire, ou que la DFP a donné son accord, ou que vous n'êtes pas assujetti aux périodes de vacances du calendrier universitaire de l'UTT, contactez directement un administrateur (en haut à droite)."
      )
      .catch(console.error);
  } else if (
    [(await msg.member.fetch()).roles.cache
      .keys()].includes(process.env.ROLE_ENSEIGNANT_ID)
  ) {
    let nomChannel;
    if (!msg.member.nickname) nomChannel = msg.member.user.username;
    else nomChannel = msg.member.nickname;
    if (msg.mentions.roles.first())
      nomChannel = msg.mentions.roles.first().name.toLowerCase();
    nomChannel += "-cours";
    msg.guild.channels
      .create(`${nomChannel} - vocal`, {
        parent: process.env.CATEGORY_AMPHI,
        type: "GUILD_VOICE",
        userLimit: 99
      })
      .then((channel) => {
        channel.permissionOverwrites.edit(msg.guild.roles.everyone, discordUtils.toutesPermissionsOverwrite(false));
        channel.permissionOverwrites.edit(process.env.ROLE_ENSEIGNANT_ID, discordUtils.permissionsLireEcrireProfOverwrite(true));
        if (msg.mentions.roles.first()) {
          channel.permissionOverwrites.edit(msg.mentions.roles.first(), discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
        } else {
          channel.permissionOverwrites.edit(process.env.ROLE_ETUDIANT_ID, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
        }
        if (!(msg.member.id in tableauChannelsVocauxEnCours))
          tableauChannelsVocauxEnCours[msg.member.id] = [];
        tableauChannelsVocauxEnCours[msg.member.id].push(channel.id);
        msg.member.voice.setChannel(channel.id).catch(console.error);
      })
      .catch(console.error);
    msg.guild.channels
      .create(nomChannel, {
        parent: process.env.CATEGORY_AMPHI,
      })
      .then(async (channel) => {
        await channel.permissionOverwrites.edit(msg.guild.roles.everyone, discordUtils.toutesPermissionsOverwrite(false));
        await channel.permissionOverwrites.edit(process.env.ROLE_ENSEIGNANT_ID, discordUtils.permissionsLireEcrireProfOverwrite(true));
        if (msg.mentions.roles.first()) {
          await channel.permissionOverwrites.edit(msg.mentions.roles.first(), discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
        } else {
          await channel.permissionOverwrites.edit(process.env.ROLE_ETUDIANT_ID, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
        }
        if (!(msg.member.id in tableauChannelsVocauxEnCours))
          tableauChannelsVocauxEnCours[msg.member.id] = [];
        tableauChannelsVocauxEnCours[msg.member.id].push(channel.id);
        (await msg.guild.channels.resolve(channel.id))
          .send(
            `:speaking_head: <@${msg.member.id}> Votre amphi vient d'être créé. Vous disposez d'un canal textuel (celui que vous regardez, visible à gauche et qui commence par #), et d'un canal vocal où vous pouvez parler jusqu'à 100 personnes, et 50 maximum si vous partagez votre écran.` +
              `\n:wastebasket: **Les canaux voix et texte seront effacés dès que plus personne ne sera dans le canal vocal.**` +
              `\n\n:writing_hand: Si vous souhaitez conserver le tchat, pensez à taper la commande \`/ UE export\`, **sans l'espace entre / et UE**. Seul un enseignant ou un modérateur/administrateur peut utiliser cette commande qui génére un fichier zip contenant tout la conversation du tchat textuel utilisable dans un navigateur web, même hors ligne.` +
              `\n\n:tools: Vous pouvez renommer vos salons sur la gauche qui portent votre nom pour leur donner le nom de l'UE par exemple (clic-droit sur le salon à gauche, modifier le salon puis enregistrer les changements)` +
              `\n\n:toolbox: En bas à gauche, à côté de voix connectée, vous disposez de 5 boutons.` +
              `\nLes deux boutons au dessus permettent de diffuser votre écran (bouton flèche dans l'écran) ou de mettre fin à la communication (bouton téléphone avec la croix).` +
              `\nLes trois boutons du bas permettent de couper votre micro (ne plus parler), ou votre casque (ne plus entendre), et d'accéder aux paramètres de Discord grâce à la roue crantée.` +
              `\n\n:grey_question: Tapez \`/UE\` pour voir la liste des commandes. N'hésitez pas à envoyer un message à la modération (tapez \`@ Modération\` sans espace) ou l'administration (\`@ Administrateur\`, sans espace) du serveur en cas de souci.` +
              `\n\n:school: Bon cours !\n\n`
          )
          .then(async (message) => {
            message.pin().catch(console.error);
            if (msg.mentions.roles.first()) {
              channel
                .send(
                  `:loudspeaker: Etudiants de <@&${
                    msg.mentions.roles.first().id
                  }>, votre enseignant ${
                    msg.member.nickname ? msg.member.nickname : msg.author.tag
                  } vient de créer un amphi !`
                )
                .catch(console.error);
              const channelEtudiants = msg.guild.channels.cache.find(
                (chan) =>
                  chan.type === "GUILD_TEXT" &&
                  chan.name.toLowerCase() ===
                    msg.mentions.roles.first().name.toLowerCase()
              );
              if (channelEtudiants)
                channelEtudiants.send(
                  `:school: <@&${
                    msg.mentions.roles.first().id
                  }> Votre enseignant ${
                    msg.member.nickname ? msg.member.nickname : msg.author.tag
                  } vient de créer un amphi <#${channel.id}>`
                );
            }
          });
      })
      .catch(console.error);
  } else {
    msg
      .reply(
        `Vous n'êtes ni étudiant, ni enseignant. Connectez vous sur ${process.env.BOT_URL} pour vous faire attribuer vos droits sur le serveur.`
      )
      .catch(console.error);
    (await msg.guild.channels.resolve(process.env.CHANNEL_ADMIN_ID))
      .send(
        ` :octagonal_sign: Alerte ! ${msg.author.tag} / ${msg.member.nickname} a tenté de lancer un vocal en n'étant ni enseignant ni étudiant.`
      )
      .catch(console.error);
  }
};
