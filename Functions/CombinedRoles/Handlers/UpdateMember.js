const { PermissionsBitField, Events } = require("discord.js");
const Pistil = require("../../../Modules/Pistil");

const handle = async (oldMember, newMember) => {
    if (!newMember.managable) return;

    var server = Pistil.server.load(newMember.guild.id);

    for (var [ role_1, role_2, role_combined ] of server.combinedRoles) {
        if (newMember.roles.cache.hasAll(role_1, role_2))
            newMember.roles.add(role_combined, "Glaze Flower: Combined role.");
        else
            newMember.roles.remove(role_combined, "Glaze Flower: Combined role.");
    }
}

module.exports = {
    event: Events.GuildMemberUpdate,
    handle
}