let utils = require("../../utils");
let shell = require("shelljs");
const uniqid = require("uniqid");
let path = require("path");

module.exports = async function (/** module:"discord.js".Message */ msg) {
  if (!process.env.DISCORD_CHAT_EXPORT_PATH || !process.env.DISCORD_CHAT_EXPORTER_EXE_PATH)
 {
    msg.reply(
      " :warning: L'exécution actuelle ne prend pas en charge l'export."
    );
  } else if (
    (await msg.member.fetch()).roles.highest.comparePositionTo(
      process.env.ROLE_ENSEIGNANT_ID
    ) >= 0
  ) {
    let nomChannel = utils.remove_non_ascii(msg.channel.name) + "-" + uniqid();
    msg.channel
      .send(
        "Lancement de l'export. Cette commande peut prendre un certain temps (2 minutes max, notifier un administrateur en cas de délai plus long !)"
      )
      .then(function () {
        shell.exec(
          "dotnet " +
            process.env.DISCORD_CHAT_EXPORTER_EXE_PATH +
            " export -t " +
            process.env.BOT_TOKEN +
            " -b -c " +
            msg.channel.id +
            " -f HtmlDark -o " +
            process.env.DISCORD_CHAT_EXPORT_PATH +
            nomChannel +
            ".html > /dev/null"
        );
        shell.exec(
          "wget --mirror --restrict-file-names=windows --page-requisites --adjust-extension --convert-links --execute robots=off --span-hosts -Dlocalhost,cdn.discordapp.com,cdnjs.cloudflare.com -P " +
            process.env.DISCORD_CHAT_EXPORT_PATH +
            nomChannel +
            " --user-agent mozilla http://localhost:8000/" +
            nomChannel +
            ".html 2>&1 | grep -i 'failed\\|error'"
        );
        shell.exec(
          "touch " +
            process.env.DISCORD_CHAT_EXPORT_PATH +
            nomChannel +
            "/Ouvrez_le_dossier_localhost_et_ouvrez_le_fichier_html_dans_navigateur_web"
        );
        shell.exec(
          "cd " +
            process.env.DISCORD_CHAT_EXPORT_PATH +
            nomChannel +
            " && zip -q -r " +
            path.join(
              __dirname,
              "..",
              "..",
              "public",
              "exports",
              nomChannel + ".zip"
            ) +
            " *"
        );
        shell.exec(
          "rm -rf " + process.env.DISCORD_CHAT_EXPORT_PATH + nomChannel + "*"
        );
        //Windows : shell.exec("del "+process.env.DISCORD_CHAT_EXPORT_PATH+nomChannel+".html");
        msg.channel
          .send(
            "L'export est accessible ici pendant une durée limitée, téléchargez-le vite : " +
              process.env.BOT_URL +
              "/exports/" +
              nomChannel +
              ".zip\nVous devez extraire les fichiers du fichier zip, et ensuite ouvrir le fichier html du dossier localhost. La personne à l'origine de la commande a également reçu le lien et les instructions en message privé."
          )
          .catch(console.error);
        msg.author
          .send(
            "L'export est accessible ici pendant une durée limitée, téléchargez-le vite : " +
              process.env.BOT_URL +
              "/exports/" +
              nomChannel +
              ".zip\nVous devez extraire les fichiers du fichier zip, et ensuite ouvrir le fichier html du dossier localhost."
          )
          .catch(console.error);
      })
      .catch(console.error);
  } else {
    msg
      .reply(
        " :octagonal_sign: Action non autorisée ! Seul un enseignant ou une personne ayant un rôle supérieur peut lancer cette commande."
      )
      .catch(console.error);
  }
};
