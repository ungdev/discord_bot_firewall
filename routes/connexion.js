const router = require("express").Router();
const axios = require("axios");
const httpBuildQuery = require("http-build-query");
const utils = require("../utils");

router.get("/", (req, res) => {
  /** S'il y a bien un token dans la requete, on continue */
  if (req.query.code) {
    /** On vérifie le token en demandant un auth_code permanent au site etu */
    const donnees = {
      grant_type: "authorization_code",
      scopes: "public",
      code: req.query.code,
      client_id: process.env.SITE_ETU_CLIENT_ID,
      client_secret: process.env.SITE_ETU_CLIENT_SECRET,
    };
    let accessToken = "";
    axios
      .post(`${utils.baseUrl}/api/oauth/token?${httpBuildQuery(donnees)}`)
      .then((response) => {
        accessToken = response.data.access_token.toString();
        /** Si autorisation ok, on affiche le formulaire de saisie de l'identifiant discord */
        if (accessToken !== "") {
          res.render("formulaire", {
            token: accessToken,
            lienDiscord: process.env.LIEN_INVITATION_DISCORD,
          });
        } else
          res.send(
            "Nous n'avons pas pu vous authentifier. <a href='/'>Revenir au départ</a>"
          );
        /** Message d'erreur sinon invitant l'utilisateur à recommencer */
      })
      .catch(() => {
        res.send(utils.texteBug);
      });
  }
});

module.exports = router;
