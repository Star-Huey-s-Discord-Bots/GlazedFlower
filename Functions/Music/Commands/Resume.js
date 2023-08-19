const dcv = require("@discordjs/voice");

const Pistil = require("../../../Modules/Pistil.js");

const { client } = global;

var handle = async (body) => {
    var guildAudio = client.audios.find(a => a.guildId == body.guild.id);
    if (!guildAudio) {
        body.xReply("Cannot find the audio player to unpause.");
        return;
    }

    guildAudio.player.unpause();
    guildAudio.paused = false;

    await body.reply(`Successfully unpaused the audio player.`);
    Pistil.commandLog(body);
};

module.exports = {
    name: "resume",
    arguments: [],
    handle
}