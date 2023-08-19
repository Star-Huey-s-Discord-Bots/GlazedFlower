const { Events, PermissionFlagsBits } = require("discord.js");

const $      = require("../Modules/Logger.js");
const Pistil = require("../Modules/Pistil.js");

var handle = async (guild) => {
    var guild = await guild.fetch();

    var cliMember = guild.members.cache.find(m => m.user.id == Pistil.bot.id);
    if (
        cliMember 
     && cliMember.user.id == Pistil.bot.id 
     && cliMember.permissions.has(PermissionFlagsBits.ChangeNickname)
    ) cliMember.setNickname(Pistil.bot.defaultNickname);

    $(`Joined &n${guild.name}&r`);
};

module.exports = { event: Events.GuildCreate, handle };