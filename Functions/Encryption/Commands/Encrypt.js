const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Pistil = require("../../../Modules/Pistil");

const Cryptr = require("cryptr");

var handle = async (body) => {
    var { content, token } = body.arguments;
    
    const cryptr = new Cryptr(token);

    var result = cryptr.encrypt(content);

    if (body.isMessage())
        await body.reply(
            `> ${body.user.toString()} has encrypted some secret text...`
          + "```" + result + "```"
        );
    else
        await body.xReply({
            content: `Successfully encrypted your secret text.`
                   + "```" + result + "```",
            components: [
                new ActionRowBuilder()
                    .addComponents([
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("📢")
                            .setLabel("Publish in channel")
                            .setCustomId("encryption_publish")
                    ])
            ]
        });
}

module.exports = {
    name: "encrypt",
    arguments: [
        { key: "content", type: "string", required: true },
        { key: "token",   type: "string", required: true }
    ],
    handle
};