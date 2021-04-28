let router = require("express").Router();
let utils = require("../utils");
const axios = require("axios");
let httpBuildQuery = require("http-build-query");
let shell = require("shelljs");
const assignFromWeb = require("../assignFromWeb");
/* eslint-disable no-restricted-syntax, no-await-in-loop */

module.exports = function cron(/** module:"discord.js".Client" */ client) {

  router.get("/cleanExports", function(req, res) {
    res.send("ok");
    res.end();
    console.log("Nettoyage des exports !");
    shell.exec(
      "rm -rf " +
      process.env.DISCORD_CHAT_EXPORT_PATH +
      "*"
    );
  });

  router.get("/sync", async function(req, res) {
    res.send("Sync lancée !");
    res.end();

    let donnees = {
      grant_type: "client_credentials",
      scopes: "public",
      client_id: process.env.SITE_ETU_CLIENT_ID,
      client_secret: process.env.SITE_ETU_CLIENT_SECRET,
    };
    let accessToken = "";
    let requestToken = await axios.post(utils.baseUrl + "/api/oauth/token?" + httpBuildQuery(donnees));
    accessToken = requestToken.data.access_token.toString();
    if (accessToken !== "") {
      let requete = { 'wantsJoinUTTDiscord': true, "access_token": accessToken, "page": 1 };
        let guild = client.guilds.cache.get(process.env.SERVER_ID);
        let compteur = 0;
        let pageRequest = await axios.get(utils.baseUrl + "/api/public/users?" + httpBuildQuery(requete));
        for(const currentPage of Array.from(Array(pageRequest.data.pagination.totalPages).keys())) {
          requete.page = currentPage + 1;
          let response = await axios.get(utils.baseUrl + "/api/public/users?" + httpBuildQuery(requete));
          for(const etuUser of response.data.data) {
            if (etuUser.discordTag) {
              assignFromWeb.etuToDiscord(
                        etuUser,
                        etuUser.discordTag,
                        guild
                      ).catch(console.error);
              compteur += 1;
            }
          }
        }
        console.log(compteur+" utilisateurs traités.");
      } else {
        console.error("Erreur cron vers le site etu !!")
      }
  });

  return router;
}
