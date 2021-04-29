const router = require("express").Router();
const axios = require("axios");
const httpBuildQuery = require("http-build-query");
const shell = require("shelljs");
const path = require("path");
const utils = require("../utils");
const assignFromWeb = require("../assignFromWeb");
/* eslint-disable no-restricted-syntax, no-await-in-loop */

module.exports = function cron(
  /** module:"discord.js".Client" */ client,
  nameOverride
) {
  router.get("/cleanExports", (req, res) => {
    res.send("ok");
    res.end();
    console.log("Nettoyage des exports !");
    shell.exec(`rm -rf ${path.join(__dirname, "..", "public", "exports")}/*`);
  });

  router.get("/sync", async (req, res) => {
    res.send("Sync lancée !");
    res.end();

    const donnees = {
      grant_type: "client_credentials",
      scopes: "public",
      client_id: process.env.SITE_ETU_CLIENT_ID,
      client_secret: process.env.SITE_ETU_CLIENT_SECRET,
    };
    let accessToken = "";
    const requestToken = await axios.post(
      `${utils.baseUrl}/api/oauth/token?${httpBuildQuery(donnees)}`
    );
    accessToken = requestToken.data.access_token.toString();
    if (accessToken !== "") {
      const requete = {
        wantsJoinUTTDiscord: true,
        access_token: accessToken,
        page: 1,
      };
      const guild = client.guilds.cache.get(process.env.SERVER_ID);
      let compteur = 0;
      const pageRequest = await axios.get(
        `${utils.baseUrl}/api/public/users?${httpBuildQuery(requete)}`
      );
      for (const currentPage of Array.from(
        Array(pageRequest.data.pagination.totalPages).keys()
      )) {
        requete.page = currentPage + 1;
        const response = await axios.get(
          `${utils.baseUrl}/api/public/users?${httpBuildQuery(requete)}`
        );
        for (const etuUser of response.data.data) {
          if (etuUser.discordTag) {
            assignFromWeb
              .etuToDiscord(etuUser, etuUser.discordTag, guild, nameOverride)
              .catch(console.error);
            compteur += 1;
          }
        }
      }
      console.log(`${compteur} utilisateurs traités.`);
    } else {
      console.error("Erreur cron vers le site etu !!");
    }
  });

  return router;
};
