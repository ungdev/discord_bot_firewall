module.exports = async function (
  /** module:"discord.js".Message */ msg,
  /** Array<String> */ parametres
) {
  if (parametres.length < 3)
    msg
      .reply(
        " :warning: Vous devez spécifier l'ID du message à supprimer des pins."
      )
      .catch(console.error);
  else {
    let message = await (await msg.channel.messages.fetchPinned()).get(
      parametres[2]
    );
    if (!message)
      msg
        .reply(
          " :warning: Votre message n'a pas pu être trouvé dans la liste des messages pin. Vous devez spécifier l'ID du message."
        )
        .catch(console.error);
    else message.unpin().catch(console.error);
  }
};
