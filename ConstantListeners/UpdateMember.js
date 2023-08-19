const { Events, PermissionFlagsBits } = require("discord.js");

const $      = require("../Modules/Logger.js");
const Pistil = require("../Modules/Pistil.js");

var handle = async (oldMember, newMember) => {
    if (
        newMember.user.id  == Pistil.bot.id
     && newMember.nickname != Pistil.bot.defaultNickname
     && newMember.permissions.has(PermissionFlagsBits.ChangeNickname)
    ) newMember.setNickname(Pistil.bot.defaultNickname);
};

module.exports = { event: Events.GuildMemberUpdate, handle };