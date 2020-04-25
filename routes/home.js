let router = require("express").Router();
let utils = require("../utils");
let httpBuildQuery = require("http-build-query");

router.get("/", function (req, res) {
  /** Redirige tout de suite l'utilisateur vers le site etu pour authentification. La route de retour est /connexion */
  let donnees = {
    client_id: process.env.SITE_ETU_CLIENT_ID,
    response_type: "code",
    state: "xyz",
  };
  res.redirect(
    utils.baseUrl + "/api/oauth/authorize?" + httpBuildQuery(donnees)
  );
});

router.get("/status", function (req, res) {
  res.send("Application up and running !");
});

module.exports = router;
