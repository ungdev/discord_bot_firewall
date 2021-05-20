const router = require("express").Router();
const axios = require("axios");
const httpBuildQuery = require("http-build-query");
const utils = require("../utils");
const assignFromWeb = require("../assignFromWeb");

module.exports = function attribuerRole(
  /** module:"discord.js".Client" */ client,
  nameOverride,
  bannedLoginUsers
) {
  router.get("/", (req, res) => {
    /** On vérifie qu'on a toutes les infos du formulaire */
    if (req.query.site_etu_token && req.query.discordUsername) {
      if (req.query.checkRGPD !== "on")
        res.send(
          "Vous n'avez pas coché la case de consentement RGPD. Vos données n'ont pas été traitées. <a href='/'>Revenir au départ et recommencer !</a>"
        );
      else {
        const donnees = {
          access_token: req.query.site_etu_token,
        };

        /** On récupère les données de l'utilisateur sur le site etu */
        axios
          .get(
            `${utils.baseUrl}/api/public/user/account?${httpBuildQuery(
              donnees
            )}`
          )
          .then(async (response) => {
            /** L'utilisateur du site etu dans membreSiteEtu */
            const membreSiteEtu = response.data.data;
            /** Si on arrive à savoir si l'user est étu ou pas */
            if (typeof membreSiteEtu.isStudent !== "undefined") {
              const guild = client.guilds.cache.get(process.env.SERVER_ID);
              if (!bannedLoginUsers.includes(membreSiteEtu.login)) {
                res.send(
                  await assignFromWeb.etuToDiscord(
                    membreSiteEtu,
                    req.query.discordUsername,
                    guild,
                    nameOverride
                  )
                );
              } else {
                guild.channels
                  .resolve(process.env.CHANNEL_ADMIN_ID)
                  .send(
                    `:rotating_light: L'utilisateur banni ${membreSiteEtu.login} a essayé de se connecter avec l'identifiant ${req.query.discordUsername}`
                  );
                res.send("Connexion impossible car vous avez été banni.");
              }
            } else res.send(utils.texteBug);
            /** Si le token n'a pas pu être validé (tentative de hacking, ...), affiche un message */
          })
          .catch((error) => {
            console.log(error.message);
            res.send(utils.texteBug);
          });
      }
    } else {
      /** Si tous les champs n'ont pas pu être trouvés, affiche un message */
      res.send(
        "Le formulaire est incomplet. <a href='/'>Revenir au départ</a>"
      );
    }
  });

  return router;
};
