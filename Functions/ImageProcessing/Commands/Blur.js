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

    var { radius } = body.arguments;
    if (0 >= radius || radius > 100) {
        body.xReply("Blur radius must be between 0 and 100.");
        return;
    }

    images.forEach(image => {
        Jimp.read(image.url)
            .then(jimpResult =>
                jimpResult
                    .blur(radius)
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

    Pistil.commandLog(body, `by &a${radius}px&r`);
}

module.exports = {
    name: "blur",
    arguments: [
        { key: "radius", type: "float", default: 1 },
    ],
    handle
};