const Pistil = require("../../../Modules/Pistil.js");

const { client } = global;

var handle = async (body) => {
    var guildAudio = client.audios.find(a => a.guildId == body.guild.id);
    if (!guildAudio) {
        await body.xReply("Cannot find the audio player to stop.");
        return;
    }

    guildAudio.player.stop();
    guildAudio.active = false;

    await body.reply(`Successfully stopped playing.`);
    Pistil.commandLog(body);
};

module.exports = {
    name: "stop",
    arguments: [],
    handle
}