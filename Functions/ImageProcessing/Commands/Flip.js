const { PermissionFlagsBits, AttachmentBuilder } = require("discord.js");

const Pistil = require("../../../Modules/Pistil");

const Jimp = require("jimp");

var handle = async (body) => {
    if (!Pistil.checkPermissions(
        body.channel, 
        PermissionFlagsBits.AttachFiles
    )) {
        body.xReply("Missing permissions.");
        return;
    }

    if (!body.reference) {
        body.xReply("You're not replying to another message.");
        return;
    }
    var refMsgId = body.reference.messageId;

    var refMsg = new Pistil.getter({ channel: body.channel })
        .message(refMsgId);
    if (!refMsg) {
        body.xReply("Failed to load message, maybe it's too old.");
        return;
    }

    var images = new Array();
    refMsg.attachments.forEach(atm => {
        if ([ "image/png", "image/jpeg" ].includes(atm.contentType))
            images.push(atm);
    })

    if (!images.length) {
        body.xReply("Your replying message has no legal-format image.");
        return;
    }

    body.channel.sendTyping();

    images.forEach(image => {
        Jimp.read(image.url)
            .then(jimpResult =>
                jimpResult
                    .flip(false, true)
                    .getBuffer(image.contentType, (err, buffer) => {
                        if (err) {
                            body.xReply("Errors occur while processing images.");
                            return;
                        }
                        refMsg.channel.send({
                            files: [
                                new AttachmentBuilder()
                                    .setFile(buffer)
                            ]
                        });
                    })
            )      
    });

    Pistil.commandLog(body);
}

module.exports = {
    name: "flip",
    arguments: [],
    handle
};