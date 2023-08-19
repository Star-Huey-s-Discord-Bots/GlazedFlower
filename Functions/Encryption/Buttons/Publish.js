const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var { content } = body.message;

    await body.channel.send(
        `> ${body.user.toString()} has encrypted some secret text...`
      + "```" + content.split("```")[1] + "```"
    );

    await body.update({
        content: "Successfully done.",
        components: []
    });
};

module.exports = {
    name: "encryption_publish",
    arguments: [],
    handle
}