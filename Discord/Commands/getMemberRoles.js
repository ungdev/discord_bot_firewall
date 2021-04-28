module.exports = async function getMemberRoles(
  /** module:"discord.js".Message */ msg
) {
  if (!msg.mentions.members.first()) {
    msg.reply(
      ":warning: La syntaxe de cette commande est `getMemberRoles @membre`"
    );
  } else {
    let tableau = [];
    msg.mentions.members.first().roles.cache.forEach(function (role) {
      tableau.push(role.name.replace("@", ""));
    });
    msg.channel
      .send(
        ":white_check_mark: L'utilisateur a " +
          tableau.length +
          " roles : " +
          tableau.join(", ")
      )
      .catch(console.error);
  }
};
