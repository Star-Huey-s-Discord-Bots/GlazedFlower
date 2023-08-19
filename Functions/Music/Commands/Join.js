const dcv = require("@discordjs/voice");

const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var voiceState = body.member.voice;

    if (!voiceState.sessionId) {
        await body.xReply("You didn't connect to any voice channel.");
        return;
    }

    dcv.joinVoiceChannel({
        channelId: voiceState.channel.id,
        guildId: body.guild.id,
        adapterCreator: body.guild.voiceAdapterCreator,
    });

    await body.reply(`Successfully connected to <#${voiceState.channel.id}>`);
    Pistil.commandLog(body, `connected to &n#${voiceState.channel.name}`);
};

module.exports = {
    name: "join",
    arguments: [],
    handle
}