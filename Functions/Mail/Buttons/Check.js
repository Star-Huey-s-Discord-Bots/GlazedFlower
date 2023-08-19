const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const Pistil = require("../../../Modules/Pistil.js");

var handle = async (body) => {
    var idv = Pistil.idv.load(body.guild.id, body.user.id);

    if (!idv.mails.length) {
        body.xReply("There's no mail.\nNote the icons of the mailboxes.")
    }
};

module.exports = {
    name: "mail",
    arguments: [
        { key: "userId", type: "integer" }
    ],
    handle
}