const { Events, PermissionFlagsBits } = require("discord.js");

const $      = require("../Modules/Logger.js");
const Pistil = require("../Modules/Pistil.js");

var handle = async (cli) => {
    cli.user.setPresence(Pistil.bot.presence);

    cli.guilds.cache.forEach((guild) => {
        var cliMember = guild.members.cache.find(m => m.user.id == cli.user.id);
        if (
            cliMember 
         && cliMember.user.id == cli.user.id 
         && cliMember.permissions.has(PermissionFlagsBits.ChangeNickname)
        ) cliMember.setNickname(Pistil.bot.defaultNickname);
    });
    
    $(`Connected client &n@${cli.user.tag}`);
    $(`Detected &b${cli.guilds.cache.size}&r guilds`);

    let i = cli.guilds.cache.size; 
    cli.guilds.cache.forEach((g) => {
        $((i == 1 ? "└ " : "├ ") 
        + g.name);
        i -= 1;
    })
};

module.exports = { event: Events.ClientReady, handle };