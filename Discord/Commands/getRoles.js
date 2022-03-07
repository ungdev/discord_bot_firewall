module.exports = async function getRoles(
    /** import("discord.js").Message */ msg,
    /** Array<String> */ parametres
) {
    if (parametres.length !== 3) {
        msg.reply(
            ` :warning:  Erreur. La syntaxe est \`${process.env.BOT_PREFIX} getRoles NombreDePersonnes\`.`
        ).catch(console.error);
        return;
    }
    const nbMembers = parseInt(parametres[2]);
    const roles = (await msg.guild.roles.fetch())
        .filter(role => role.members.size === nbMembers)
        .map(role => role.name);
    await msg.channel.send(
        `:white_check_mark: ${roles.length} roles ont été identifiés : \n -` + roles.join(", ")
    );
};
