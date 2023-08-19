const dcv = require("@discordjs/voice");

const Pistil = require("../../../Modules/Pistil.js");

const { client } = global;

var handle = async (body) => {
    var guildAudio = client.audios.find(a => a.guildId == body.guild.id);
    if (!guildAudio) {
        body.xReply("Cannot find the audio player to pause.");
        return;
    }

    guildAudio.player.pause();
    guildAudio.paused = true;

    await body.reply(`Successfully paused the audio player.`);
    Pistil.commandLog(body);
};

module.exports = {
    name: "pause",
    arguments: [],
    handle
}