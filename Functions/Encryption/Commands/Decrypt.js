const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Pistil = require("../../../Modules/Pistil");

const Cryptr = require("cryptr");

var handle = async (body) => {
    var { content, token } = body.arguments;
    
    const cryptr = new Cryptr(token);


    var result;
    try {
        result = cryptr.decrypt(content);
    }
    catch (err) {
        if (err.message)
            body.xReply("Cannot decrypt your text:\n> " + err.message + ".");
        else
            body.xReply(
                "An anonymous error occured while decrypting your text."
            );
        return;
    }

    if (body.isMessage())
        await body.reply(
            `> ${body.user.toString()} has decrypted some secret text...`
          + "```" + result + "```"
        );
    else
        await body.xReply({
            content: `Successfully decrypted your secret text.`
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
    name: "decrypt",
    arguments: [
        { key: "content", type: "string", required: true },
        { key: "token",   type: "string", required: true }
    ],
    handle
};