const { PermissionFlagsBits: Permissions } = require("discord.js");
const Pistil = require("../../../Modules/Pistil");

var handle = async (body) => {
    if (!Pistil.checkPermissions(
        body.channel, 
        Permissions.ManageWebhooks
    )) {
        body.xReply("Missing permissions.");
        return;
    }
    var { user, content } = body.arguments;

    await body.deferReply({ ephemeral: true });

    if (body.isMessage())
        if (Pistil.checkPermissions(
            body.channel, 
            Permissions.ManageMessages
        )) await body.delete();

    var webhook = await body.channel.createWebhook({
        name: user.member.nickname ?? user.username,
        avatar: user.displayAvatarURL(),
        reason: `Glazed Flower - /impersonate by @${body.user.tag}`
    });

    await webhook.send(content.replaceAll("\\n", "\n"));

    await webhook.delete();

    if (!body.isMessage())
        await body.followUp("Successfully done.");
    Pistil.commandLog(body, `sent \"${content.short()}\" as &n@${user.tag}`);
}

module.exports = {
    name: "impersonate",
    arguments: [
        { key: "user",    type: "user" },
        { key: "content", type: "string" }
    ],
    handle
};