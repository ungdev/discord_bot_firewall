module.exports = async function getMemberRoles(
    /** import("discord.js").Message */ msg
) {
    if (!msg.mentions.members.first()) {
        await msg.reply(
            ":warning: La syntaxe de cette commande est `getMemberRoles @membre`"
        );
    } else {
        const roles = msg.mentions.members.first().roles.cache.map(role => role.name);
        await msg.channel.send(
            `:white_check_mark: L'utilisateur a ${roles.length} roles : ${roles.join(", ")}`
        ).catch(console.error);
    }
};
