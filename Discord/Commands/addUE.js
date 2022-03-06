require("discord.js");
const {ChannelTypes} = require("discord.js/typings/enums");
const {createUeChannel} = require("../discordUtils");


module.exports = async function addUE(
    /** import("discord.js").Message */ msg,
    /** Array<String> */ args
) {
    /** S'il n'y a pas 3 paramètres dont la mention d'un role ni de ce qui doit être créé */
    if (
        args.length !== 5 ||
        !msg.mentions.roles.first() ||
        !["texte", "vocal", "lesdeux"].includes(args[4].toLowerCase())
    ) {
        msg.reply(
            " :warning:  Erreur. La syntaxe est \`${process.env.BOT_PREFIX} addUE @RoleUE <categoryID> texte | vocal " +
            "| lesDeux\`. La catégorie et le rôle doivent déjà exister."
        ).catch(console.error);
    } else {
        /** Si tout va bien */
        const channel_type = args[4].toLowerCase();
        const channel_role = msg.mentions.roles.first();
        const category = args[3];
        const channel_name = msg.mentions.roles.first().name.toLowerCase();
        /** On crée le texte avec aucune permission pour @everyone et les permissions d'écrire pour le rôle concerné */
        if (["texte", "lesdeux"].includes(channel_type)) {
            await createUeChannel(
                msg.guild, channel_name, channel_role, category, ChannelTypes.GUILD_TEXT
            );
        }
        /** On crée le vocal avec aucune permission pour @everyone et les permissions de parler/connecter pour le rôle concerné */
        if (["vocal", "lesdeux"].includes(channel_type)) {
            await createUeChannel(
                msg.guild, channel_name, channel_role, category, ChannelTypes.GUILD_VOICE
            );
        }
        msg.react('✅').catch(console.error);
    }
};
