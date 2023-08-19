const dcv = require("@discordjs/voice");

const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var guildConnection = dcv.getVoiceConnection(body.guild.id);
    if (!guildConnection) {
        await body.xReply("I didn't connect to any voice channel.");
        return;
    }

    guildConnection.destroy();

    await body.reply(`Successfully disconnected.`);
    Pistil.commandLog(body);
};

module.exports = {
    name: "leave",
    arguments: [],
    handle
}