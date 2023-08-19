const { PermissionFlagsBits } = require("discord.js");

const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    if (!Pistil.checkPermissions(body.channel, PermissionFlagsBits.ManageRoles)) {
        body.xReply("Missing permission.");
        return;
    }
    var server = Pistil.server.load(body.guild.id);

    body.reply("Starting to force-reload combined roles, this may take a few minutes.");

    var suceeded = 0, failed = 0;
    for (let mem of body.guild.members.cache.values()) {
        if (!mem.manageable) {
            failed++;
            continue;
        }

        try {
            for (let [ role_1, role_2, role_combined ] of server.combinedRoles) {
                if (mem.roles.cache.hasAll(role_1, role_2)) {
                    if (!mem.roles.cache.has(role_combined))
                        await mem.roles.add(role_combined, "Glaze Flower: Combined role.");
                }
                else {
                    if (mem.roles.cache.has(role_combined))
                        await mem.roles.remove(role_combined, "Glaze Flower: Combined role.");
                }
            }
        }
        catch (err) {
            failed++;
            continue;
        }

        suceeded++;
    }

    body.followUp(`Done. ${suceeded} suceeded, ${failed} failed.`);

    Pistil.commandLog(body);
};

module.exports = {
    name: "combined-roles reload",
    arguments: [],
    handle
};