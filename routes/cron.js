let router = require("express").Router();
let utils = require("../utils");
const axios = require("axios");
let httpBuildQuery = require("http-build-query");
const assignFromWeb = require("../assignFromWeb");

module.exports = function (/** module:"discord.js".Client" */ client) {

  router.get("/cleanExports", function(req, res) {
    res.send("ok");
    console.log("Nettoyage des exports !");
    let shell = require("shelljs");
    shell.exec(
      "rm -rf " +
      process.env.DISCORD_CHAT_EXPORT_PATH +
      "*"
    );
  });

  router.get("/sync", function(req, res) {
    res.send("Sync lancée !");

    let donnees = {
      grant_type: "client_credentials",
      scopes: "public",
      client_id: process.env.SITE_ETU_CLIENT_ID,
      client_secret: process.env.SITE_ETU_CLIENT_SECRET,
    };
    let access_token = "";
    axios
      .post(utils.baseUrl + "/api/oauth/token?" + httpBuildQuery(donnees))
      .then(function(request_token) {
        access_token = request_token.data.access_token.toString();
        /** Si autorisation ok, on affiche le formulaire de saisie de l'identifiant discord */
        if (access_token !== "") {
          let requete = { 'wantsJoinUTTDiscord': true, "access_token": access_token, "page": 1 };

          let otherPage = true;
          let guild = client.guilds.cache.get(process.env.SERVER_ID);
          let compteur = 0;
          axios.get(utils.baseUrl + "/api/public/users?" + httpBuildQuery(requete)).then(async (page_request) => {
            for (const i of Array(page_request.data.pagination.totalPages)) {
              axios.get(utils.baseUrl + "/api/public/users?" + httpBuildQuery(requete)).then(async (response) => {
                  otherPage = response.data.pagination.next ? true : false;
                  requete.page = requete.page + 1;
                  for (const etuUser of response.data.data) {
                    if (etuUser.discordTag !== undefined && etuUser.discordTag !== "") {
                      await assignFromWeb.etuToDiscord(
                        etuUser,
                        etuUser.discordTag,
                        guild
                      ).catch(console.error);
                      compteur += 1;
                    }
                  }
                }
              );
            }
          }).then(() => console.log(compteur+" utilisateurs traités."));
        } else {
          console.error("Erreur cron vers le site etu !!")
        }
      });
  });

  return router;
}