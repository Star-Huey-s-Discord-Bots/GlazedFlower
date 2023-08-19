const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Pistil = require("../../../Modules/Pistil");

var handle = async (body) => {
    var emoji = body.message.components[0].components[1].emoji
    var value = parseInt(body.message.components[0].components[1].label);

    value -= 1;

    body.update({
        content: body.message.content,
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
                        .setEmoji(emoji)
                        .setLabel(value.toString())
                    ,
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setCustomId("scoreboard_add")
                        .setEmoji("▶️")
                ])
        ]
    })
}

module.exports = {
    name: "scoreboard_remove",
    arguments: [],
    handle
};