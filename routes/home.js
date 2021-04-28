const router = require("express").Router();
const httpBuildQuery = require("http-build-query");
const utils = require("../utils");

router.get("/", (req, res) => {
  /** Redirige tout de suite l'utilisateur vers le site etu pour authentification. La route de retour est /connexion */
  const donnees = {
    client_id: process.env.SITE_ETU_CLIENT_ID,
    response_type: "code",
    state: "xyz",
  };
  res.redirect(
    `${utils.baseUrl}/api/oauth/authorize?${httpBuildQuery(donnees)}`
  );
});

router.get("/status", (req, res) => {
  res.send("Application up and running !");
});

module.exports = router;
