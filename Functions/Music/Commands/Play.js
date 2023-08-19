const { EmbedBuilder } = require("discord.js");
const dcv = require("@discordjs/voice");
const { default: scdl } = require("soundcloud-downloader");

const Pistil = require("../../../Modules/Pistil.js");

const { client } = global;

var handle = async (body) => {
    var currentConnection = dcv.getVoiceConnection(body.guild.id);
    if (!currentConnection) {
        if (!body.member.voice.channel) {
            await body.xReply("I didn't connect to any voice channel.");
            return;
        }
        currentConnection = dcv.joinVoiceChannel({
            channelId: body.member.voice.channel.id,
            guildId: body.guild.id,
            adapterCreator: body.guild.voiceAdapterCreator,
        });
    }

    var guildAudio = client.audios.find(a => a.guildId == body.guild.id),
        player;
    if (guildAudio) {
        player = guildAudio.player;
    }
    else {
        player = dcv.createAudioPlayer();
    }
    currentConnection.subscribe(player);

    var { url } = body.arguments, 
        soundcloudResource;
        
    if (!url.startsWith("https://soundcloud.com/") && !url.startsWith("https://m.soundcloud.com/")) {
        await body.xReply("Only support Soundcloud URL for now.");
        return;
    }

    body.deferReply();

    var invalid = false,
        trackInfo;
    await scdl.getInfo(url).then((info) => trackInfo = info).catch((_) => invalid = true);
    if (invalid) {
        await body.followUp({ content: "Cannot load song info from the given URL.", ephemeral: true });
        return;
    }

    await scdl.download(url)
        .then(stream => {
            soundcloudResource = dcv.createAudioResource(stream, { inlineVolume: true });
        })
        .catch((_) => {
            invalid = true;
        });
    if (invalid) {
        await body.followUp({ content: "Cannot download song from the given URL.", ephemeral: true });
        return;
    }

    var server = Pistil.server.load(body.guild.id);
    soundcloudResource.volume.setVolume(server.volume);

    var newAudio = {
        guildId: body.guild.id,
        player: player,
        resource: soundcloudResource,
        active: true,
        paused: false
    };

    var guildAudioIndex = client.audios.findIndex(a => a.guildId == body.guild.id);
    if (guildAudioIndex == -1) {
        client.audios.push(newAudio);
    }
    else {
        client.audios[guildAudioIndex] = newAudio;
    }

    player.play(soundcloudResource);
    
    await body.followUp({ embeds: [
        new EmbedBuilder()
            .setAuthor({ name: "Successfully loaded song." })
            .setColor(0x0dfd0d)
            .setTitle(trackInfo.title + "\u200B")
            .setURL(trackInfo.permalink_url)
            .setDescription(trackInfo.description + "\u200B")
            .setImage(trackInfo.artwork_url ? trackInfo.artwork_url.replace("large", "t500x500") : null)
            .setFooter({ text: `${trackInfo.likes_count} likes` })
            .setTimestamp(new Date(trackInfo.created_at))
    ] });
    if (server.volume <= 0.5)
        await body.xFollowUp(
            "Please note that your volume is very low, use `/volume` to adjust it."
        );

    Pistil.commandLog(body, `played \"${
        trackInfo.title.length <= 50           ? 
        trackInfo.title.replaceAll("&", "&&")  :
        `${trackInfo.title.slice(0, 50).replaceAll("&", "&&")}...`
    }\"`);
};

module.exports = {
    name: "play",
    arguments: [
        { key: "url", type: "string", required: true }
    ],
    handle
}