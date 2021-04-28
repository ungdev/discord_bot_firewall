let router = require("express").Router();
let utils = require("../utils");
const axios = require("axios");
let httpBuildQuery = require("http-build-query");
let shell = require("shelljs");
const assignFromWeb = require("../assignFromWeb");

module.exports = function (/** module:"discord.js".Client" */ client) {

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
    let access_token = "";
    let request_token = await axios.post(utils.baseUrl + "/api/oauth/token?" + httpBuildQuery(donnees));
    access_token = request_token.data.access_token.toString();
    if (access_token !== "") {
      let requete = { 'wantsJoinUTTDiscord': true, "access_token": access_token, "page": 1 };

        let otherPage = true;
        let guild = client.guilds.cache.get(process.env.SERVER_ID);
        let compteur = 0;
        let page_request = await axios.get(utils.baseUrl + "/api/public/users?" + httpBuildQuery(requete));
        for (const i of Array(page_request.data.pagination.totalPages)) {
          let response = await axios.get(utils.baseUrl + "/api/public/users?" + httpBuildQuery(requete));
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
        console.log(compteur+" utilisateurs traités.");
      } else {
        console.error("Erreur cron vers le site etu !!")
      }
  });

  return router;
}
