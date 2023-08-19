const dcv = require("@discordjs/voice");

const Pistil = require("../../../Modules/Pistil.js");

const { client } = global;

var handle = async (body) => {
    var { value } = body.arguments;
    var volumeScale = Math.floor(value) / 100;
    if (0 > volumeScale || volumeScale > 2) {
        volumeScale = 1;
    }

    var guildAudio = client.audios.find(a => a.guildId == body.guild.id);
    if (guildAudio) {
        guildAudio.resource.volume.setVolume(volumeScale);
    }

    var server = Pistil.server.load(body.guild.id);
    server.volume = volumeScale;
    Pistil.server.save(body.guild.id, server);

    await body.reply(`The volume has been set to ${volumeScale * 100}%.`);
    Pistil.commandLog(body, `set volume to &a${volumeScale * 100}%`);
};

module.exports = {
    name: "volume",
    arguments: [
        { key: "value", type: "integer", required: true }
    ],
    handle
}