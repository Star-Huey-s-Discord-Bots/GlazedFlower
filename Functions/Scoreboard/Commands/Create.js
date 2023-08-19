const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Pistil = require("../../../Modules/Pistil");

const CircleEmoji = require("../Tools/CircleEmoji.js")

var handle = async (body) => {
    var { color, content, "default-value": defaultValue } = body.arguments;

    console.log(defaultValue)

    await body.xDeferReply();

    await body.channel.send({
        content,
        components: [
            new ActionRowBuilder()
                .addComponents([
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("scoreboard_remove")
                        .setEmoji("◀️")
                    ,
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("scoreboard_value")
                        .setEmoji(CircleEmoji[color])
                        .setLabel(defaultValue.toString())
                    ,
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("scoreboard_add")
                        .setEmoji("▶️")
                ])
        ]
    });

    if (!body.isMessage())
        body.xFollowUp("Successfully done.");
    
    Pistil.commandLog(body);
}

module.exports = {
    name: "scoreboard",
    arguments: [
        { key: "color", type: "integer", required: true, choices: {
            "red":    0,
            "yellow": 1,
            "green":  2,
            "blue":   3,
            "purple": 4
        } },
        { key: "default-value", type: "integer", required: false, default: 0 },
        { key: "content", type: "string", required: false, default: "" }
    ],
    handle
};