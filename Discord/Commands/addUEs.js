const discordUtils = require("../discordUtils");

/**
 * Return an array of string corresponding to UE codes belonging to the category given in parameters
 * @param branch
 * @returns {string[]}
 */
function parseUes(/** String */branch) {
    /** RT:RE12,RE16;GI:MT14,... */
    const uesPerBranch = process.env.UES_PER_BRANCH;
    for (const branchUes of uesPerBranch.split(";")) {
        if (branchUes.split(":")[0].toUpperCase() === branch) {
            return branchUes.split(":")[1].split(",");
        }
    }
}

function parseElectedRoles(branch) {
    /** RT:Cat1,Cat2:Cperf;GI */
    /*
    * C'est censé faire quoi, au juste, ça ?
    * Les noms de variables ont vraiment besoin d'être plus longs que la bite de Marcoccia ?
    * */
    const branchCategoriesAndElectedRole = process.env.BRANCH_CATEGORIES_AND_ELECTED_ROLE;
    let currentCategories = [];
    let currentElectedRole = "";
    for (const currentBranchCategoriesAndElectedRole of branchCategoriesAndElectedRole.split(";")) {
        if (currentBranchCategoriesAndElectedRole.split(":")[0].toUpperCase() === branch) {
            currentCategories = currentBranchCategoriesAndElectedRole.split(":")[1].split(",");
            currentElectedRole = currentBranchCategoriesAndElectedRole.split(":")[2];
        }
    }
    return [currentCategories, currentElectedRole];
}

module.exports = async function addUEs(
    /** import("discord.js").Message */ msg,
    /** Array<String> */ args
) {
    /** S'il n'y a pas 3 paramètres dont la mention d'un role ni de ce qui doit être créé */
    if (args.length !== 4) {
        msg.reply(
            ` :warning:  Erreur. La syntaxe est \`${process.env.BOT_PREFIX} addUEs <branche> texte | vocal | lesDeux\`.`
        ).catch(console.error);
        return;
    }

    /** Si tout va bien */
    const branch = args[2].toUpperCase();
    const channel_type = args[3].toLowerCase();
    const ues = parseUes(branch);
    
    // A quoi servent ces variables ?
    const [currentCategories, currentElectedRole] = parseElectedRoles(branch);

    if (ues.length === 0 || currentCategories.length === 0) {
        msg.reply(" :warning: Aucune branche trouvée !").catch(console.error);
        return;
    }
    const roles = await msg.guild.roles.fetch();
    const channelsCounts = [];
    for (const category in currentCategories) {
        channelsCounts[category] = msg.guild.channels.cache.get(currentCategories[category]).children.size;
    }

    let i = 0;
    const maxChannelsPerCategory = 50;

    /*
    * Pure crappy unmaintainable garbage.
    * */
    for (const ue of ues) {
        const ueRole = await roles.find(
            (role) => role.name.toUpperCase() === ue.toUpperCase()
        );
        if (!ueRole) {
            msg.channel.send(` :grey_question: Pas de rôle pour ${ue}`);
            break;
        }
        while ((channelsCounts[i] + (channel_type === "lesdeux" ? 2 : 1)) > maxChannelsPerCategory && i < currentCategories.length) {
            i++;
        }
        if (i >= currentCategories.length) {
            msg.reply(` :bangbang: Limite de canaux par catégories atteinte (maximum ${maxChannelsPerCategory}) pour toutes les catégories spécifiées. Arrêt de la création de canaux.`).catch(console.error);
            return;
        }
        if (["texte", "lesdeux"].includes(channel_type)) {
            if (!msg.guild.channels.cache.find(channel => channel.name.toLowerCase() === ue.toLowerCase())) {
                msg.guild.channels
                    .create(ue.toLowerCase(), {
                        parent: currentCategories[i]
                    })
                    .then((channel) => {
                        channelsCounts[i] += 1;
                        channel.permissionOverwrites.edit(msg.guild.roles.everyone, discordUtils.toutesPermissionsOverwrite(false));
                        channel.permissionOverwrites.edit(ueRole, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
                        if (currentElectedRole.length > 0) {
                            channel.permissionOverwrites.edit(currentElectedRole, discordUtils.permissionsLireEcrireBasiquesOverwrite(true));
                        }
                        channel.send(
                            `Bonjour <@&${
                                ueRole.id
                            }>, votre channel texte vient d'être créé !`
                        );
                        msg.channel.send(` :white_check_mark: Canal texte ${ue.toLowerCase()} créé`).catch(console.error);
                    })
                    .catch(console.error);
            } else {
                msg.channel.send(` :zzz: Le canal texte ${ue.toLowerCase()} existe déjà !`);
            }
        }
        /** On crée le vocal avec aucune permission pour @everyone et les permissions de parler/connecter pour le rôle concerné */
        if (["vocal", "lesdeux"].includes(channel_type)) {
            if (!msg.guild.channels.cache.find(channel => channel.name.toLowerCase() === ue.toLowerCase() + " - vocal")) {
                msg.guild.channels
                    .create(`${ue.toLowerCase()} - vocal`, {
                        parent: currentCategories[i],
                        type: "GUILD_VOICE",
                        userLimit: 99
                    }).then((channel => {
                    channelsCounts[i] += 1;
                    channel.permissionOverwrites.edit(
                        msg.guild.roles.everyone,
                        discordUtils.toutesPermissionsOverwrite(false)
                    );
                    channel.permissionOverwrites.edit(
                        ueRole.id,
                        discordUtils.permissionsLireEcrireBasiquesOverwrite(true)
                    );
                    if (currentElectedRole.length > 0) {
                        channel.permissionOverwrites.edit(
                            currentElectedRole,
                            discordUtils.permissionsLireEcrireBasiquesOverwrite(true)
                        );
                    }
                    msg.channel.send(
                        ` :white_check_mark: Canal vocal ${ue.toLowerCase()} - vocal créé`
                    ).catch(console.error);
                })).catch(console.error);
            } else {
                msg.channel.send(` :zzz: Le canal vocal ${ue.toLowerCase()} - vocal existe déjà.`)
            }
        }
    }
};
